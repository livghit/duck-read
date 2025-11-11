<?php

use App\Models\Book;
use App\Models\BookCacheMetadata;
use App\Services\BookCacheManager;
use Illuminate\Support\Facades\Cache;
use Illuminate\Support\Facades\Http;

beforeEach(function () {
    $this->cacheManager = app(BookCacheManager::class);
    Cache::clear();
    Book::query()->delete();
    BookCacheMetadata::query()->delete();
});

describe('BookCacheManager', function () {
    describe('clearExpiredCache()', function () {
        it('removes expired cache entries', function () {
            $book = Book::factory()->create(['cached_from_ol' => true]);

            BookCacheMetadata::create([
                'book_id' => $book->id,
                'cache_key' => 'test_key_1',
                'hit_count' => 5,
                'expires_at' => now()->subDay(),
            ]);

            BookCacheMetadata::create([
                'book_id' => $book->id,
                'cache_key' => 'test_key_2',
                'hit_count' => 3,
                'expires_at' => now()->addDay(),
            ]);

            $deleted = $this->cacheManager->clearExpiredCache();

            expect($deleted)->toBe(1);
            expect(BookCacheMetadata::count())->toBe(1);
        });
    });

    describe('getCacheStats()', function () {
        it('returns accurate cache statistics', function () {
            $book = Book::factory()->create(['cached_from_ol' => true]);

            BookCacheMetadata::create([
                'book_id' => $book->id,
                'cache_key' => 'key1',
                'hit_count' => 10,
                'expires_at' => now()->addDay(),
            ]);

            BookCacheMetadata::create([
                'book_id' => $book->id,
                'cache_key' => 'key2',
                'hit_count' => 5,
                'expires_at' => now()->subDay(),
            ]);

            $stats = $this->cacheManager->getCacheStats();

            expect($stats['total_entries'])->toBe(2);
            expect($stats['active_entries'])->toBe(1);
            expect($stats['expired_entries'])->toBe(1);
            expect($stats['top_hits'])->toHaveCount(2);
        });
    });

    describe('getBooksNeedingSync()', function () {
        it('returns books not synced recently', function () {
            $syncedBook = Book::factory()->create([
                'cached_from_ol' => true,
                'ol_last_synced_at' => now()->subDays(5),
            ]);

            $oldBook = Book::factory()->create([
                'cached_from_ol' => true,
                'ol_last_synced_at' => now()->subDays(40),
            ]);

            $neverSynced = Book::factory()->create([
                'cached_from_ol' => true,
                'ol_last_synced_at' => null,
            ]);

            $books = $this->cacheManager->getBooksNeedingSync(30);

            expect($books)->toHaveCount(2);
            expect($books->pluck('id'))->toContain($oldBook->id, $neverSynced->id);
            expect($books->pluck('id'))->not->toContain($syncedBook->id);
        });

        it('respects limit parameter', function () {
            Book::factory(5)->create([
                'cached_from_ol' => true,
                'ol_last_synced_at' => null,
            ]);

            $books = $this->cacheManager->getBooksNeedingSync(30, 2);

            expect($books)->toHaveCount(2);
        });
    });

    describe('syncBookMetadata()', function () {
        it('updates book metadata from Open Library', function () {
            Http::fake([
                'openlibrary.org/works/OL123W.json' => Http::response([
                    'title' => 'Updated Title',
                    'authors' => [['name' => 'Updated Author']],
                    'key' => '/works/OL123W',
                    'description' => 'Updated description',
                    'publish_date' => '2020',
                ]),
            ]);

            $book = Book::factory()->create([
                'external_id' => '/works/OL123W',
                'title' => 'Old Title',
                'cached_from_ol' => true,
            ]);

            $result = $this->cacheManager->syncBookMetadata($book);

            expect($result)->toBeTrue();
            expect($book->refresh()->title)->toBe('Updated Title');
            expect($book->ol_sync_status)->toBe('success');
            expect($book->ol_last_synced_at)->not->toBeNull();
        });

        it('marks sync as failed when API returns nothing', function () {
            Http::fake([
                'openlibrary.org/works/OL123W.json' => Http::response([], 404),
            ]);

            $book = Book::factory()->create([
                'external_id' => '/works/OL123W',
                'cached_from_ol' => true,
            ]);

            $result = $this->cacheManager->syncBookMetadata($book);

            expect($result)->toBeFalse();
            expect($book->refresh()->ol_sync_status)->toBe('failed');
        });

        it('returns false for books without external_id', function () {
            $book = Book::factory()->create([
                'external_id' => null,
                'cached_from_ol' => true,
            ]);

            $result = $this->cacheManager->syncBookMetadata($book);

            expect($result)->toBeFalse();
        });
    });

    describe('getHotCacheKeys()', function () {
        it('returns frequently accessed cache keys', function () {
            $book1 = Book::factory()->create(['cached_from_ol' => true]);
            $book2 = Book::factory()->create(['cached_from_ol' => true]);

            BookCacheMetadata::create([
                'book_id' => $book1->id,
                'cache_key' => 'hot_key',
                'hit_count' => 10,
            ]);

            BookCacheMetadata::create([
                'book_id' => $book2->id,
                'cache_key' => 'cold_key',
                'hit_count' => 2,
            ]);

            $hotKeys = $this->cacheManager->getHotCacheKeys(5);

            expect($hotKeys)->toContain('hot_key');
            expect($hotKeys)->not->toContain('cold_key');
        });
    });

    describe('invalidateCache()', function () {
        it('removes cache entry and metadata', function () {
            $book = Book::factory()->create(['cached_from_ol' => true]);

            $metadata = BookCacheMetadata::create([
                'book_id' => $book->id,
                'cache_key' => 'test_key',
                'hit_count' => 5,
            ]);

            Cache::put('test_key', 'test_data', 3600);

            $this->cacheManager->invalidateCache('test_key');

            expect(Cache::has('test_key'))->toBeFalse();
            expect(BookCacheMetadata::count())->toBe(0);
        });
    });

    describe('invalidateBookCache()', function () {
        it('removes all cache for a specific book', function () {
            $book = Book::factory()->create(['cached_from_ol' => true]);

            BookCacheMetadata::create([
                'book_id' => $book->id,
                'cache_key' => 'key1',
                'hit_count' => 5,
            ]);

            BookCacheMetadata::create([
                'book_id' => $book->id,
                'cache_key' => 'key2',
                'hit_count' => 3,
            ]);

            $deleted = $this->cacheManager->invalidateBookCache($book->id);

            expect($deleted)->toBe(2);
            expect(BookCacheMetadata::count())->toBe(0);
        });
    });

    describe('getCacheHitRatio()', function () {
        it('calculates hit ratio correctly', function () {
            $book = Book::factory()->create(['cached_from_ol' => true]);

            BookCacheMetadata::create([
                'book_id' => $book->id,
                'cache_key' => 'key1',
                'hit_count' => 10,
            ]);

            BookCacheMetadata::create([
                'book_id' => $book->id,
                'cache_key' => 'key2',
                'hit_count' => 20,
            ]);

            $ratio = $this->cacheManager->getCacheHitRatio();

            // 30 total hits / 2 entries = 15
            expect($ratio)->toBe(15.0);
        });

        it('returns 0 when no cache entries', function () {
            $ratio = $this->cacheManager->getCacheHitRatio();

            expect($ratio)->toBe(0.0);
        });
    });
});
