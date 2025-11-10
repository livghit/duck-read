<?php

namespace App\Services;

use Illuminate\Support\Facades\Cache;
use Illuminate\Support\Facades\Http;

class BookSearchService
{
    protected const OPENLIBRARY_API = 'https://openlibrary.org/search.json';

    protected const CACHE_DURATION = 60 * 60 * 24; // 24 hours

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

        return Cache::remember($cacheKey, self::CACHE_DURATION, function () use ($query, $author) {
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

        return Cache::remember($cacheKey, self::CACHE_DURATION, function () use ($externalId) {
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
}
