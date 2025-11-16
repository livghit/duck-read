<?php

namespace App\Console\Commands;

use App\Models\Book;
use App\Services\BookImportService;
use App\Services\BookSearchService;
use Illuminate\Console\Command;

class BackfillBookDescriptions extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'books:backfill-descriptions 
                            {--limit= : Maximum number of books to update} 
                            {--force : Update books even if they already have descriptions}';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Fetch and backfill descriptions and additional details for books from OpenLibrary Works API';

    /**
     * Execute the console command.
     */
    public function handle(BookSearchService $searchService, BookImportService $importService): int
    {
        $limit = $this->option('limit') ? (int) $this->option('limit') : null;
        $force = $this->option('force');

        // Query books that need descriptions
        $query = Book::whereNotNull('ol_work_key');

        if (! $force) {
            $query->where(function ($q) {
                $q->whereNull('description')
                    ->orWhereNull('subjects')
                    ->orWhereNull('subtitle');
            });
        }

        if ($limit) {
            $query->limit($limit);
        }

        $books = $query->get();

        if ($books->isEmpty()) {
            $this->info('No books found that need descriptions.');

            return self::SUCCESS;
        }

        $this->info("Found {$books->count()} books to update.");

        $progressBar = $this->output->createProgressBar($books->count());
        $progressBar->start();

        $updated = 0;
        $skipped = 0;
        $failed = 0;

        foreach ($books as $book) {
            try {
                // Fetch work details
                $workDetails = $searchService->fetchWorkDetails($book->ol_work_key);

                if ($workDetails && ! empty($workDetails)) {
                    // Update book with work details
                    $book->update([
                        'description' => $workDetails['description'] ?? $book->description,
                        'subjects' => $workDetails['subjects'] ?? $book->subjects,
                        'subtitle' => $workDetails['subtitle'] ?? $book->subtitle,
                        'excerpt' => $workDetails['excerpt'] ?? $book->excerpt,
                        'links' => $workDetails['links'] ?? $book->links,
                        'first_publish_date' => $workDetails['first_publish_date'] ?? $book->first_publish_date,
                        'last_synced_at' => now(),
                    ]);

                    $updated++;
                } else {
                    $skipped++;
                }

                // Small delay to respect rate limits
                usleep(100000); // 0.1 second delay
            } catch (\Exception $e) {
                $this->error("\nFailed to update book {$book->id} ({$book->title}): {$e->getMessage()}");
                $failed++;
            }

            $progressBar->advance();
        }

        $progressBar->finish();
        $this->newLine(2);

        $this->info('Backfill completed!');
        $this->table(
            ['Status', 'Count'],
            [
                ['Updated', $updated],
                ['Skipped', $skipped],
                ['Failed', $failed],
            ]
        );

        return self::SUCCESS;
    }
}
