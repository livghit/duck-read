<?php

namespace Database\Seeders;

use App\Models\Book;
use App\Models\Review;
use App\Models\ToReviewList;
use App\Models\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class DemoAccountSeeder extends Seeder
{
    public function run(): void
    {
        $demoUser = User::firstOrCreate(
            ['email' => 'account@demo.de'],
            [
                'name' => 'Demo User',
                'password' => Hash::make('121275Edward'),
                'email_verified_at' => now(),
            ]
        );

        $books = $this->createDemoBooks();
        $this->createDemoReviews($demoUser, $books);
        $this->createDemoToReviewList($demoUser, $books);
    }

    private function createDemoBooks(): array
    {
        $books = [
            [
                'title' => 'Clean Code',
                'author' => 'Robert C. Martin',
                'description' => 'Even bad code can function. But if code isn\'t clean, it can bring a development organization to its knees. Every year, countless hours and significant resources are lost because of poorly written code. But it doesn\'t have to be that way.',
                'isbn' => '978-0132350884',
                'cover_url' => 'https://covers.openlibrary.org/b/id/8946165-M.jpg',
                'publisher' => 'Prentice Hall',
                'published_year' => 2008,
                'number_of_pages' => 464,
                'subjects' => ['Software Engineering', 'Programming', 'Computer Science'],
                'first_publish_date' => '2008-08-01',
            ],
            [
                'title' => 'The Pragmatic Programmer',
                'author' => 'Andrew Hunt and David Thomas',
                'description' => 'This book will help you become a better programmer. It covers topics ranging from personal responsibility and career development to architectural techniques for keeping your code flexible and easy to adapt and reuse.',
                'isbn' => '978-0201616224',
                'cover_url' => 'https://covers.openlibrary.org/b/id/9505645-M.jpg',
                'publisher' => 'Addison-Wesley',
                'published_year' => 1999,
                'number_of_pages' => 352,
                'subjects' => ['Programming', 'Software Development', 'Career'],
                'first_publish_date' => '1999-10-30',
            ],
            [
                'title' => 'Design Patterns',
                'author' => 'Erich Gamma, Richard Helm, Ralph Johnson, John Vlissides',
                'description' => 'Capturing a wealth of experience about the design of object-oriented software, four top-notch designers present a catalog of simple and succinct solutions to commonly occurring design problems.',
                'isbn' => '978-0201633610',
                'cover_url' => 'https://covers.openlibrary.org/b/id/7988788-M.jpg',
                'publisher' => 'Addison-Wesley',
                'published_year' => 1994,
                'number_of_pages' => 395,
                'subjects' => ['Software Design', 'Programming', 'Computer Science'],
                'first_publish_date' => '1994-10-21',
            ],
            [
                'title' => 'Refactoring',
                'author' => 'Martin Fowler',
                'description' => 'Refactoring is about improving the design of existing code. It is the process of changing a software system in such a way that it does not alter the external behavior of the code yet improves its internal structure.',
                'isbn' => '978-0201485677',
                'cover_url' => 'https://covers.openlibrary.org/b/id/1045467-M.jpg',
                'publisher' => 'Addison-Wesley',
                'published_year' => 1999,
                'number_of_pages' => 431,
                'subjects' => ['Software Engineering', 'Programming'],
                'first_publish_date' => '1999-07-08',
            ],
            [
                'title' => 'Thinking, Fast and Slow',
                'author' => 'Daniel Kahneman',
                'description' => 'The major New York Times bestseller that is changing the way we think about thinking. In this groundbreaking tour of the mind, Daniel Kahneman takes us on a groundbreaking tour of the mind and explains the two systems that drive the way we think.',
                'isbn' => '978-0374533557',
                'cover_url' => 'https://covers.openlibrary.org/b/id/11282651-M.jpg',
                'publisher' => 'Farrar, Straus and Giroux',
                'published_year' => 2011,
                'number_of_pages' => 499,
                'subjects' => ['Psychology', 'Cognitive Science', 'Decision Making'],
                'first_publish_date' => '2011-10-25',
            ],
            [
                'title' => 'Atomic Habits',
                'author' => 'James Clear',
                'description' => 'No matter your goals, Atomic Habits offers a proven framework for improving every day. James Clear, one of the world\'s leading experts on habit formation, reveals practical strategies that will teach you exactly how to form good habits, break bad ones, and master the tiny behaviors that lead to remarkable results.',
                'isbn' => '978-0735211292',
                'cover_url' => 'https://covers.openlibrary.org/b/id/11173877-M.jpg',
                'publisher' => 'Avery',
                'published_year' => 2018,
                'number_of_pages' => 320,
                'subjects' => ['Self-Help', 'Productivity', 'Psychology'],
                'first_publish_date' => '2018-10-16',
            ],
            [
                'title' => 'Sapiens: A Brief History of Humankind',
                'author' => 'Yuval Noah Harari',
                'description' => null,
                'isbn' => '978-0062316097',
                'cover_url' => 'https://covers.openlibrary.org/b/id/12582659-M.jpg',
                'publisher' => 'Harper',
                'published_year' => 2014,
                'number_of_pages' => 464,
                'subjects' => ['History', 'Anthropology', 'Science'],
                'first_publish_date' => '2014-02-10',
            ],
            [
                'title' => 'Deep Work',
                'author' => 'Cal Newport',
                'description' => null,
                'isbn' => '978-1455586691',
                'cover_url' => 'https://covers.openlibrary.org/b/id/12704547-M.jpg',
                'publisher' => 'Grand Central Publishing',
                'published_year' => 2016,
                'number_of_pages' => 304,
                'subjects' => ['Productivity', 'Self-Help', 'Business'],
                'first_publish_date' => '2016-01-05',
            ],
            [
                'title' => 'The Art of War',
                'author' => 'Sun Tzu',
                'description' => null,
                'isbn' => '978-1599869773',
                'cover_url' => 'https://covers.openlibrary.org/b/id/1038043-M.jpg',
                'publisher' => 'General Press',
                'published_year' => -500,
                'number_of_pages' => null,
                'subjects' => ['Military Strategy', 'Philosophy', 'Leadership'],
                'first_publish_date' => null,
            ],
            [
                'title' => 'The Great Gatsby',
                'author' => 'F. Scott Fitzgerald',
                'description' => 'The story of the fabulously wealthy Jay Gatsby and his love for the beautiful Daisy Buchanan, of lavish parties on Long Island at a time when The New York Times noted "gin was the national drink and sex the national obsession," it is an exquisitely crafted tale of America in the 1920s.',
                'isbn' => '978-0743273565',
                'cover_url' => 'https://covers.openlibrary.org/b/id/8441861-M.jpg',
                'publisher' => 'Scribner',
                'published_year' => 1925,
                'number_of_pages' => 180,
                'subjects' => ['Fiction', 'Classic Literature', 'American Literature'],
                'first_publish_date' => '1925-04-10',
            ],
        ];

        $createdBooks = [];

        foreach ($books as $bookData) {
            $book = Book::create($bookData);
            $createdBooks[] = $book;
        }

        return $createdBooks;
    }

    private function createDemoReviews(User $user, array $books): void
    {
        $allReviews = [
            [
                'book_id' => $books[0]->id,
                'rating' => 5,
                'content' => 'Absolutely essential reading for any developer. The principles in this book have transformed how I write code. Clear explanations and practical examples make it easy to apply to real-world projects. I\'ve already recommended this to my entire team. This is the book that launched my clean code journey.',
                'created_at' => now()->subDays(180),
            ],
            [
                'book_id' => $books[0]->id,
                'rating' => 4,
                'content' => 'I revisited this after 3 years and the insights still hold up. The chapter on meaningful names is brilliant, though I wish there were more modern examples. Still a solid 4 stars for its impact on my career.',
                'created_at' => now()->subDays(90),
            ],
            [
                'book_id' => $books[0]->id,
                'rating' => 5,
                'content' => 'Finally read this classic after years of hearing about it. The code examples might be dated but the principles are timeless. Understanding these patterns helped me break down complex systems into manageable components. Every developer should read this.',
                'created_at' => now()->subDays(30),
            ],

            [
                'book_id' => $books[1]->id,
                'rating' => 5,
                'content' => 'A timeless classic that remains relevant decades later. The tips are practical and the writing style is engaging. This book made me rethink my entire approach to software development. The chapter on broken windows was particularly eye-opening.',
                'created_at' => now()->subYears(5),
            ],
            [
                'book_id' => $books[1]->id,
                'rating' => 4,
                'content' => 'I appreciate the wisdom in these pages, but some sections felt repetitive. Still, the core message about craftsmanship is valuable. Great for new programmers, though experienced devs might find some sections review.',
                'created_at' => now()->subYears(2),
            ],
            [
                'book_id' => $books[2]->id,
                'rating' => 4,
                'content' => 'Comprehensive reference for software design patterns. Some examples are a bit dated but core concepts are universally applicable. Great to have on shelf for quick reference when facing design challenges. The GoF patterns section is particularly useful.',
                'created_at' => now()->subYears(4),
            ],
            [
                'book_id' => $books[2]->id,
                'rating' => 5,
                'content' => 'The practical examples make abstract concepts concrete. I particularly liked the section on observer pattern and strategy pattern. Reading this alongside actual coding work helped cement my understanding. Would recommend reading multiple times to fully grasp each pattern.',
                'created_at' => now()->subYears(3),
            ],

            [
                'book_id' => $books[3]->id,
                'rating' => 5,
                'content' => 'Martin\'s writing is clear and practical. The refactoring techniques presented are still highly relevant today. I use this as a guide during code reviews and when improving legacy codebases. A must-read for any serious developer.',
                'created_at' => now()->subYears(6),
            ],
            [
                'book_id' => $books[3]->id,
                'rating' => 3,
                'content' => 'Good book but I found some examples harder to follow than necessary. The concepts are sound but the code snippets could benefit from better formatting. Still, the principles have improved my refactoring practices significantly.',
                'created_at' => now()->subYears(2),
            ],

            [
                'book_id' => $books[4]->id,
                'rating' => 5,
                'content' => 'Fascinating look into human psychology and decision-making. Kahneman does an excellent job explaining complex concepts in accessible language. This book has genuinely changed how I approach decisions in both personal and professional life. Highly recommend!',
                'created_at' => now()->subMonths(8),
            ],
            [
                'book_id' => $books[4]->id,
                'rating' => 4,
                'content' => 'The psychology insights are brilliant, though sometimes the cognitive science gets dense. The System 1 vs System 2 framework has stuck with me. Practical applications would have made this perfect.',
                'created_at' => now()->subMonths(3),
            ],

            [
                'book_id' => $books[5]->id,
                'rating' => 5,
                'content' => 'Simple yet powerful framework for building better habits. I\'ve implemented several of the techniques and have seen real improvements in my daily routines. The writing is clear and actionable. Not just theory, but practical advice you can start using immediately.',
                'created_at' => now()->subMonths(18),
            ],
            [
                'book_id' => $books[5]->id,
                'rating' => 5,
                'content' => 'This book changed my life. The idea of tiny atomic habits leading to massive results is so simple yet so effective. I now focus on 1% improvements daily. The concept of habit stacking is game-changing.',
                'created_at' => now()->subMonths(6),
            ],

            [
                'book_id' => $books[6]->id,
                'rating' => 4,
                'content' => 'Mind-blowing perspective on human history. Harari weaves together history, anthropology, and biology in a compelling narrative. Some parts are controversial, but it definitely makes you think differently about humanity\'s past and future.',
                'created_at' => now()->subMonths(12),
            ],
            [
                'book_id' => $books[7]->id,
                'rating' => 5,
                'content' => 'This book completely changed how I work. Newport\'s concept of deep work resonated strongly with me. I\'ve restructured my work habits to maximize focused time and have seen significant improvements in both productivity and satisfaction. A game-changer for knowledge workers.',
                'created_at' => now()->subMonths(9),
            ],
            [
                'book_id' => $books[7]->id,
                'rating' => 4,
                'content' => 'Excellent book, though I struggle with complete disconnection. The principles work great but modern jobs don\'t always allow 4-hour focus blocks. Adapted the ideas to my 2-hour sessions with great results.',
                'created_at' => now()->subMonths(4),
            ],

            [
                'book_id' => $books[8]->id,
                'rating' => 5,
                'content' => 'Timeless wisdom about strategy and conflict. Surprisingly applicable to business and leadership, not just military. The emphasis on knowing yourself and your enemy resonates beyond the battlefield.',
                'created_at' => now()->subYears(10),
            ],
            [
                'book_id' => $books[8]->id,
                'rating' => 4,
                'content' => 'Philosophical depth is impressive but some sections feel cryptic on first read. Requires multiple readings to fully grasp. The strategic principles are sound, though ancient context can be confusing for modern readers.',
                'created_at' => now()->subYears(8),
            ],

            [
                'book_id' => $books[9]->id,
                'rating' => 5,
                'content' => 'The story of fabulously wealthy Jay Gatsby and his love for the beautiful Daisy Buchanan, of lavish parties on Long Island at a time when The New York Times noted "gin was the national drink and sex the national obsession," it is an exquisitely crafted tale of America in the 1920s.',
                'created_at' => now()->subYears(3),
            ],
            [
                'book_id' => $books[9]->id,
                'rating' => 5,
                'content' => 'Beautifully written prose that captures the essence of the Jazz Age. Fitzgerald\'s exploration of the American Dream remains hauntingly relevant. The symbolism and character development are masterful. A masterpiece of American literature.',
                'created_at' => now()->subYears(2),
            ],
            [
                'book_id' => $books[9]->id,
                'rating' => 4,
                'content' => 'Beautiful but heartbreaking story. The themes of wealth, love, and the impossibility of repeating the past are explored brilliantly. Reading this feels like watching a beautiful tragedy unfold in slow motion.',
                'created_at' => now()->subMonths(6),
            ],
        ];

        foreach ($allReviews as $reviewData) {
            Review::create(array_merge($reviewData, ['user_id' => $user->id]));
        }
    }

    private function createDemoToReviewList(User $user, array $books): void
    {
        $toReviewBooks = [3, 6, 7];

        foreach ($toReviewBooks as $index) {
            if (isset($books[$index])) {
                ToReviewList::create([
                    'user_id' => $user->id,
                    'book_id' => $books[$index]->id,
                ]);
            }
        }
    }
}
