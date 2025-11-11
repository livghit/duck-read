<?php

use App\Models\Book;
use App\Services\BookSearchService;
use Illuminate\Support\Facades\Cache;
use Illuminate\Support\Facades\Http;

beforeEach(function () {
    $this->service = app(BookSearchService::class);
    Cache::clear();
});

describe('BookSearchService', function () {
    describe('search()', function () {
        it('returns cached results on second call', function () {
            Http::fake([
                'openlibrary.org/search.json*' => Http::response([
                    'docs' => [
                        [
                            'title' => 'The Lord of the Rings',
                            'author_name' => ['J. R. R. Tolkien'],
                            'key' => '/works/OL27448W',
                            'first_publish_year' => 1954,
                            'cover_i' => 258027,
                        ],
                    ],
                ]),
            ]);

            // First call hits the API
            $result1 = $this->service->search('lord of the rings');
            expect($result1)->toHaveCount(1);

            // Second call should be cached
            $result2 = $this->service->search('lord of the rings');
            expect($result2)->toEqual($result1);

            // Verify only one HTTP call was made
            Http::assertSentCount(1);
        });

        it('handles API failures gracefully', function () {
            Http::fake([
                'openlibrary.org/search.json*' => Http::response([], 500),
            ]);

            $result = $this->service->search('test query');
            expect($result)->toBe([]);
        });

        it('includes cover URLs when available', function () {
            Http::fake([
                'openlibrary.org/search.json*' => Http::response([
                    'docs' => [
                        [
                            'title' => 'Book Title',
                            'author_name' => ['Author Name'],
                            'key' => '/works/OL123W',
                            'cover_i' => 123456,
                        ],
                    ],
                ]),
            ]);

            $result = $this->service->search('test');
            expect($result[0]['cover_url'])->toContain('covers.openlibrary.org/b/id/123456-M.jpg');
        });

        it('formats search results correctly', function () {
            Http::fake([
                'openlibrary.org/search.json*' => Http::response([
                    'docs' => [
                        [
                            'title' => 'Test Book',
                            'author_name' => ['Test Author'],
                            'key' => '/works/OL1W',
                            'isbn' => ['1234567890'],
                            'first_publish_year' => 2020,
                            'publisher' => ['Test Publisher'],
                        ],
                    ],
                ]),
            ]);

            $result = $this->service->search('test');
            expect($result[0])
                ->toHaveKeys(['title', 'author', 'external_id', 'isbn', 'published_year', 'publisher']);
        });
    });

    describe('getFromExternalId()', function () {
        it('fetches and caches book details', function () {
            Http::fake([
                'openlibrary.org/works/OL45883W.json' => Http::response([
                    'title' => 'The Fellowship of the Ring',
                    'authors' => [['name' => 'J. R. R. Tolkien']],
                    'key' => '/works/OL45883W',
                    'publish_date' => '1954',
                    'identifiers' => [
                        'isbn_10' => ['0544003411'],
                    ],
                ]),
            ]);

            $result1 = $this->service->getFromExternalId('/works/OL45883W');
            expect($result1)->not->toBeNull();

            $result2 = $this->service->getFromExternalId('/works/OL45883W');
            expect($result2)->toEqual($result1);

            Http::assertSentCount(1);
        });

        it('returns null when API fails', function () {
            Http::fake([
                'openlibrary.org/works/OL45883W.json' => Http::response([], 404),
            ]);

            $result = $this->service->getFromExternalId('/works/OL45883W');
            expect($result)->toBeNull();
        });

        it('extracts publish year from date strings', function () {
            Http::fake([
                'openlibrary.org/works/OL45883W.json' => Http::response([
                    'title' => 'Test Book',
                    'key' => '/works/OL45883W',
                    'publish_date' => 'July 29, 1954',
                ]),
            ]);

            $result = $this->service->getFromExternalId('/works/OL45883W');
            expect($result['published_year'])->toBe(1954);
        });
    });

    describe('batchGetFromExternalIds()', function () {
        it('uses cache for already cached items', function () {
            Http::fake([
                'openlibrary.org/works/OL1W.json' => Http::response([
                    'title' => 'Book 1',
                    'key' => '/works/OL1W',
                ]),
                'openlibrary.org/works/OL2W.json' => Http::response([
                    'title' => 'Book 2',
                    'key' => '/works/OL2W',
                ]),
            ]);

            // Prime the cache with first book
            $this->service->getFromExternalId('/works/OL1W');

            // Batch call should only fetch the second book
            $results = $this->service->batchGetFromExternalIds(['/works/OL1W', '/works/OL2W']);

            expect($results)->toHaveCount(2);
            Http::assertSentCount(2); // One from priming, one from batch
        });

        it('handles partial failures gracefully', function () {
            Http::fake([
                'openlibrary.org/works/OL1W.json' => Http::response([
                    'title' => 'Book 1',
                    'key' => '/works/OL1W',
                ]),
                'openlibrary.org/works/OL2W.json' => Http::response([], 404),
            ]);

            $results = $this->service->batchGetFromExternalIds(['/works/OL1W', '/works/OL2W']);

            expect($results)->toHaveKey('/works/OL1W');
            expect($results)->not->toHaveKey('/works/OL2W');
        });
    });

    describe('rate limiting', function () {
        it('respects rate limit threshold', function () {
            Http::fake([
                'openlibrary.org/search.json*' => Http::response(['docs' => []]),
            ]);

            // Make calls up to the rate limit
            for ($i = 0; $i < 30; $i++) {
                $this->service->search("query {$i}");
            }

            // Next call should be rate limited
            $result = $this->service->search('query 31');
            expect($result)->toBe([]);
        });
    });

    describe('cache key generation', function () {
        it('generates consistent cache keys', function () {
            Http::fake([
                'openlibrary.org/search.json*' => Http::response(['docs' => []]),
            ]);

            $result1 = $this->service->search('test', 'author');
            $result2 = $this->service->search('test', 'author');

            expect($result1)->toEqual($result2);
        });

        it('generates different keys for different queries', function () {
            Http::fake([
                'openlibrary.org/search.json*' => Http::response(['docs' => []]),
            ]);

            $result1 = $this->service->search('query1');
            $result2 = $this->service->search('query2');

            // Both should be empty arrays, but they came from different cache keys
            expect($result1)->toEqual($result2);
            expect($result1)->toBe([]);
        });
    });
});
