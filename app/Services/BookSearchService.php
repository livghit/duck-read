<?php

namespace App\Services;

use App\Models\Book;
use App\Models\BookCacheMetadata;
use Illuminate\Support\Facades\Cache;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\RateLimiter;

class BookSearchService
{
    protected const OPENLIBRARY_API = 'https://openlibrary.org/search.json';

    protected const CACHE_DURATION_SEARCH = 60 * 60 * 72; // 72 hours for search results

    protected const CACHE_DURATION_DETAILS = 60 * 60 * 24 * 30; // 30 days for book details

    protected const CACHE_DURATION_COVERS = 60 * 60 * 24 * 60; // 60 days for covers

    protected const RATE_LIMIT_PER_MINUTE = 30;

    /**
     * Search for books from Open Library API
     *
     * @param  string  $query  Search query (title, author, ISBN)
     * @param  string|null  $author  Optional author filter
     * @return array Array of book data
     */
    public function search(string $query, ?string $author = null): array
    {
        $cacheKey = $this->getCacheKey('search', $query, $author);

        return Cache::remember($cacheKey, self::CACHE_DURATION_SEARCH, function () use ($query, $author) {
            // Check rate limit
            if (! $this->checkRateLimit()) {
                \Log::warning('Book search rate limit exceeded', ['query' => $query, 'author' => $author]);

                return [];
            }

            try {
                $params = [
                    'q' => $query,
                    'limit' => 20,
                ];

                if ($author) {
                    $params['author'] = $author;
                }

                $response = Http::timeout(10)->get(self::OPENLIBRARY_API, $params);

                if ($response->failed()) {
                    return [];
                }

                return $this->formatSearchResults($response->json());
            } catch (\Exception $e) {
                \Log::error('Book search failed: '.$e->getMessage());

                return [];
            }
        });
    }

    /**
     * Get book details by external ID (Open Library ID)
     *
     * @param  string  $externalId  Open Library work/edition ID
     */
    public function getFromExternalId(string $externalId): ?array
    {
        $cacheKey = $this->getCacheKey('external', $externalId);

        return Cache::remember($cacheKey, self::CACHE_DURATION_DETAILS, function () use ($externalId) {
            // Check rate limit
            if (! $this->checkRateLimit()) {
                \Log::warning('Book details rate limit exceeded', ['externalId' => $externalId]);

                return null;
            }

            try {
                $url = "https://openlibrary.org{$externalId}.json";
                $response = Http::timeout(10)->get($url);

                if ($response->failed()) {
                    return null;
                }

                return $this->formatExternalResult($response->json());
            } catch (\Exception $e) {
                \Log::error('Get external book failed: '.$e->getMessage());

                return null;
            }
        });
    }

    /**
     * Batch fetch book metadata for multiple external IDs
     *
     * @param  array  $externalIds  Array of Open Library IDs
     * @return array Array of book data keyed by external ID
     */
    public function batchGetFromExternalIds(array $externalIds): array
    {
        $results = [];
        $uncachedIds = [];

        // Check cache first
        foreach ($externalIds as $id) {
            $cacheKey = $this->getCacheKey('external', $id);
            $cached = Cache::get($cacheKey);
            if ($cached !== null) {
                $results[$id] = $cached;
            } else {
                $uncachedIds[] = $id;
            }
        }

        // Fetch uncached items with rate limiting
        foreach ($uncachedIds as $id) {
            if (! $this->checkRateLimit()) {
                \Log::warning('Batch fetch rate limit exceeded');
                break;
            }

            $bookData = $this->getFromExternalId($id);
            if ($bookData) {
                $results[$id] = $bookData;
            }
        }

        return $results;
    }

    /**
     * Format search results from Open Library
     */
    protected function formatSearchResults(array $data): array
    {
        $books = [];

        foreach ($data['docs'] ?? [] as $doc) {
            $book = [
                'title' => $doc['title'] ?? '',
                'author' => $this->extractAuthor($doc),
                'external_id' => $doc['key'] ?? null,
                'isbn' => $doc['isbn'][0] ?? null,
                'published_year' => $doc['first_publish_year'] ?? null,
                'description' => $doc['description'] ?? '',
                'publisher' => $doc['publisher'][0] ?? null,
            ];

            // Add cover URL if available
            if (isset($doc['cover_i'])) {
                $book['cover_url'] = "https://covers.openlibrary.org/b/id/{$doc['cover_i']}-M.jpg";
            }

            $books[] = $book;
        }

        return $books;
    }

    /**
     * Format external book result from Open Library
     */
    protected function formatExternalResult(array $data): array
    {
        $book = [
            'title' => $data['title'] ?? '',
            'author' => '',
            'external_id' => $data['key'] ?? null,
            'published_year' => null,
            'description' => $data['description']['value'] ?? $data['description'] ?? '',
        ];

        // Extract author
        if (isset($data['authors']) && count($data['authors']) > 0) {
            $book['author'] = $data['authors'][0]['name'] ?? '';
        }

        // Extract published year
        if (isset($data['publish_date'])) {
            preg_match('/\d{4}/', $data['publish_date'], $matches);
            if ($matches) {
                $book['published_year'] = (int) $matches[0];
            }
        }

        // Extract ISBN
        if (isset($data['identifiers']['isbn_10'])) {
            $book['isbn'] = $data['identifiers']['isbn_10'][0] ?? null;
        }

        return $book;
    }

    /**
     * Extract author from search result document
     */
    protected function extractAuthor(array $doc): string
    {
        if (isset($doc['author_name']) && count($doc['author_name']) > 0) {
            return $doc['author_name'][0];
        }

        return '';
    }

    /**
     * Generate cache key
     */
    protected function getCacheKey(string $type, ?string $query = null, ?string $author = null): string
    {
        $key = $type;
        if ($query) {
            $key .= ':'.$query;
        }
        if ($author) {
            $key .= ':'.$author;
        }

        return 'books:'.hash('sha256', $key);
    }

    /**
     * Check rate limit for API calls
     */
    protected function checkRateLimit(): bool
    {
        $key = 'ol_api_rate_limit';
        $limit = RateLimiter::attempt($key, self::RATE_LIMIT_PER_MINUTE, function () {
            return true;
        }, 60);

        return $limit;
    }

    /**
     * Get the number of API calls used this minute
     */
    public function getRateLimitUsage(): int
    {
        $key = 'ol_api_rate_limit';

        return RateLimiter::attempts($key);
    }

    /**
     * Record cache metadata for tracking purposes
     */
    protected function recordCacheMetadata(int $bookId, string $cacheKey, int $expiresInSeconds): void
    {
        BookCacheMetadata::updateOrCreate(
            ['book_id' => $bookId, 'cache_key' => $cacheKey],
            [
                'expires_at' => now()->addSeconds($expiresInSeconds),
                'hit_count' => \DB::raw('hit_count + 1'),
            ]
        );
    }
}
