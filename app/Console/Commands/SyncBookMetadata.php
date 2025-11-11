<?php

namespace App\Console\Commands;

use App\Models\Book;
use App\Services\BookCacheManager;
use Illuminate\Console\Command;

class SyncBookMetadata extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'books:sync-metadata
                            {--days=30 : Sync books not updated in N days}
                            {--limit=50 : Maximum number of books to sync}
                            {--with-reviews : Only sync books that have reviews}
                            {--with-to-review : Only sync books in to-review lists}';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Sync book metadata from Open Library API with intelligent caching';

    public function __construct(private BookCacheManager $cacheManager)
    {
        parent::__construct();
    }

    /**
     * Execute the console command.
     */
    public function handle(): int
    {
        $daysOld = (int) $this->option('days');
        $limit = (int) $this->option('limit');
        $withReviews = $this->option('with-reviews');
        $withToReview = $this->option('with-to-review');

        $this->info('Starting book metadata sync...');
        $this->info("Options: days={$daysOld}, limit={$limit}, reviews={$withReviews}, to-review={$withToReview}");

        // Get books that need syncing
        $query = Book::query()
            ->where('cached_from_ol', true)
            ->where(function ($q) use ($daysOld) {
                $q->whereNull('ol_last_synced_at')
                    ->orWhere('ol_last_synced_at', '<', now()->subDays($daysOld));
            });

        if ($withReviews) {
            $query->whereHas('reviews');
        }

        if ($withToReview) {
            $query->whereHas('toReviewLists');
        }

        $books = $query->limit($limit)->get();

        if ($books->isEmpty()) {
            $this->info('No books found that need syncing.');

            return 0;
        }

        $this->info("Found {$books->count()} books to sync.");

        $bar = $this->output->createProgressBar($books->count());
        $bar->start();

        $synced = 0;
        $failed = 0;
        $rateLimitHits = 0;

        foreach ($books as $book) {
            if ($this->cacheManager->syncBookMetadata($book)) {
                $synced++;
            } else {
                $failed++;
            }

            // Check rate limit usage
            $usage = $this->cacheManager->getRateLimitUsage();
            if ($usage >= 25) {
                $rateLimitHits++;
                $this->warn("\nRate limit approaching ({$usage}/30 calls used)");
                sleep(1);
            }

            $bar->advance();
        }

        $bar->finish();

        $this->newLine(2);
        $this->info('Sync completed!');
        $this->info("Synced: {$synced}");
        $this->info("Failed: {$failed}");
        $this->info("Rate limit warnings: {$rateLimitHits}");

        // Show cache stats
        $stats = $this->cacheManager->getCacheStats();
        $this->newLine();
        $this->table(
            ['Metric', 'Value'],
            [
                ['Total Cache Entries', $stats['total_entries']],
                ['Active Entries', $stats['active_entries']],
                ['Expired Entries', $stats['expired_entries']],
            ]
        );

        return 0;
    }
}
