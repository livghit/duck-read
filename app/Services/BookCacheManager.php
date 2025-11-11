<?php

namespace App\Services;

use App\Models\Book;
use App\Models\BookCacheMetadata;
use Illuminate\Support\Facades\Cache;

class BookCacheManager
{
    public function __construct(private BookSearchService $searchService) {}

    /**
     * Clear expired cache entries
     */
    public function clearExpiredCache(): int
    {
        return BookCacheMetadata::where('expires_at', '<', now())->delete();
    }

    /**
     * Get cache statistics
     */
    public function getCacheStats(): array
    {
        $total = BookCacheMetadata::count();
        $expired = BookCacheMetadata::where('expires_at', '<', now())->count();
        $active = $total - $expired;
        $topHits = BookCacheMetadata::orderByDesc('hit_count')
            ->limit(5)
            ->pluck('hit_count', 'cache_key')
            ->toArray();

        return [
            'total_entries' => $total,
            'active_entries' => $active,
            'expired_entries' => $expired,
            'top_hits' => $topHits,
        ];
    }

    /**
     * Get books that need syncing based on age
     */
    public function getBooksNeedingSync(int $daysOld = 30, ?int $limit = null): mixed
    {
        $query = Book::query()
            ->where('cached_from_ol', true)
            ->where(function ($q) use ($daysOld) {
                $q->whereNull('ol_last_synced_at')
                    ->orWhere('ol_last_synced_at', '<', now()->subDays($daysOld));
            })
            ->orderBy('ol_last_synced_at', 'asc');

        if ($limit) {
            $query->limit($limit);
        }

        return $query->get();
    }

    /**
     * Sync book metadata from Open Library
     */
    public function syncBookMetadata(Book $book): bool
    {
        try {
            if (! $book->external_id) {
                return false;
            }

            $data = $this->searchService->getFromExternalId($book->external_id);

            if (! $data) {
                $book->update([
                    'ol_sync_status' => 'failed',
                    'ol_last_synced_at' => now(),
                ]);

                return false;
            }

            $book->update([
                'title' => $data['title'] ?? $book->title,
                'author' => $data['author'] ?? $book->author,
                'description' => $data['description'] ?? $book->description,
                'isbn' => $data['isbn'] ?? $book->isbn,
                'published_year' => $data['published_year'] ?? $book->published_year,
                'ol_sync_status' => 'success',
                'ol_last_synced_at' => now(),
            ]);

            return true;
        } catch (\Exception $e) {
            \Log::error('Failed to sync book metadata', [
                'book_id' => $book->id,
                'error' => $e->getMessage(),
            ]);

            $book->update([
                'ol_sync_status' => 'failed',
                'ol_last_synced_at' => now(),
            ]);

            return false;
        }
    }

    /**
     * Mark cache entries for warming (high-hit items)
     */
    public function getHotCacheKeys(int $minHits = 5): array
    {
        return BookCacheMetadata::where('hit_count', '>=', $minHits)
            ->pluck('cache_key')
            ->toArray();
    }

    /**
     * Invalidate specific cache key
     */
    public function invalidateCache(string $cacheKey): bool
    {
        Cache::forget($cacheKey);
        BookCacheMetadata::where('cache_key', $cacheKey)->delete();

        return true;
    }

    /**
     * Invalidate all cache for a book
     */
    public function invalidateBookCache(int $bookId): int
    {
        $cacheKeys = BookCacheMetadata::where('book_id', $bookId)
            ->pluck('cache_key')
            ->toArray();

        foreach ($cacheKeys as $key) {
            Cache::forget($key);
        }

        return BookCacheMetadata::where('book_id', $bookId)->delete();
    }

    /**
     * Get cache hit ratio
     */
    public function getCacheHitRatio(): float
    {
        $totalHits = BookCacheMetadata::sum('hit_count');
        $totalEntries = BookCacheMetadata::count();

        if ($totalEntries === 0) {
            return 0;
        }

        return $totalHits / $totalEntries;
    }

    /**
     * Get rate limit usage
     */
    public function getRateLimitUsage(): int
    {
        return $this->searchService->getRateLimitUsage();
    }
}
