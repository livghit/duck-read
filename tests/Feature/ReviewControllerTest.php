<?php

use App\Models\Book;
use App\Models\Review;
use App\Models\User;
use Inertia\Testing\AssertableInertia as Assert;

describe('ReviewController', function () {
    describe('index', function () {
        it('returns authenticated user reviews with books', function () {
            $user = User::factory()->create();
            $books = Book::factory()->count(3)->create();
            $reviews = [];
            foreach ($books as $book) {
                $reviews[] = Review::factory()->create([
                    'user_id' => $user->id,
                    'book_id' => $book->id,
                ]);
            }

            $response = $this->actingAs($user)->get(route('reviews.index'));

            $response->assertSuccessful();
        });

        it('only returns reviews for authenticated user', function () {
            $user1 = User::factory()->create();
            $user2 = User::factory()->create();
            $books1 = Book::factory()->count(2)->create();
            $books2 = Book::factory()->count(3)->create();

            foreach ($books1 as $book) {
                Review::factory()->create(['user_id' => $user1->id, 'book_id' => $book->id]);
            }
            foreach ($books2 as $book) {
                Review::factory()->create(['user_id' => $user2->id, 'book_id' => $book->id]);
            }

            $response = $this->actingAs($user1)->get(route('reviews.index'));

            $response->assertSuccessful();
        });

        it('returns reviews in latest first order', function () {
            $user = User::factory()->create();
            $book1 = Book::factory()->create();
            $book2 = Book::factory()->create();
            $oldReview = Review::factory()->create([
                'user_id' => $user->id,
                'book_id' => $book1->id,
                'created_at' => now()->subDays(5),
            ]);
            $newReview = Review::factory()->create([
                'user_id' => $user->id,
                'book_id' => $book2->id,
                'created_at' => now(),
            ]);

            $response = $this->actingAs($user)->get(route('reviews.index'));

            $response->assertSuccessful();
        });

        it('requires authentication', function () {
            $response = $this->get(route('reviews.index'));

            $response->assertRedirect(route('login'));
        });
    });

    describe('create', function () {
        it('provides a list of recent books and optional preselection', function () {
            $user = User::factory()->create();
            $books = Book::factory()->count(25)->create();
            $selected = $books->first();

            $response = $this->actingAs($user)->get(route('reviews.create', ['book_id' => $selected->id]));

            $response->assertOk()
                ->assertInertia(fn (Assert $page) => $page
                    ->component('reviews/form')
                    ->has('books', 20)
                    ->where('books.0', function ($book) {
                        expect($book)->toHaveKeys(['id', 'title', 'author']);
                        expect($book)->toHaveKey('cover_url');

                        return true;
                    })
                    ->where('selectedBookId', $selected->id)
                );
        });

        it('provides empty books list when none exist', function () {
            $user = User::factory()->create();

            $response = $this->actingAs($user)->get(route('reviews.create'));

            $response->assertOk()
                ->assertInertia(fn (Assert $page) => $page
                    ->component('reviews/form')
                    ->has('books', 0)
                    ->where('selectedBookId', null)
                );
        });

        it('requires authentication', function () {
            $response = $this->get(route('reviews.create'));

            $response->assertRedirect(route('login'));
        });
    });

    describe('show', function () {
        it('returns a review with its book', function () {
            $user = User::factory()->create();
            $review = Review::factory()->create(['user_id' => $user->id]);

            $response = $this->actingAs($user)->get(route('reviews.show', $review));

            $response->assertSuccessful();
        });

        it('requires authentication', function () {
            $review = Review::factory()->create();

            $response = $this->get(route('reviews.show', $review));

            $response->assertRedirect(route('login'));
        });

        it('returns 404 for non-existent review', function () {
            $user = User::factory()->create();

            $response = $this->actingAs($user)->get(route('reviews.show', 99999));

            $response->assertNotFound();
        });
    });

    describe('store', function () {
        it('creates a review for authenticated user and cleans up to-review list', function () {
            $user = User::factory()->create();
            $book = Book::factory()->create();

            // Pre-add book to to-review list
            $user->toReviewLists()->create([
                'book_id' => $book->id,
                'added_at' => now(),
            ]);

            $response = $this->actingAs($user)->post(route('reviews.store'), [
                'book_id' => $book->id,
                'rating' => 5,
                'content' => 'Great book! Highly recommended.',
            ]);

            $response->assertRedirect(route('reviews.index'));

            $this->assertDatabaseHas('reviews', [
                'user_id' => $user->id,
                'book_id' => $book->id,
                'rating' => 5,
            ]);
            $this->assertDatabaseMissing('to_review_lists', [
                'user_id' => $user->id,
                'book_id' => $book->id,
            ]);
        });

        it('prevents duplicate reviews for same book', function () {
            $user = User::factory()->create();
            $book = Book::factory()->create();
            Review::factory()->create([
                'user_id' => $user->id,
                'book_id' => $book->id,
            ]);

            $response = $this->actingAs($user)->post(route('reviews.store'), [
                'book_id' => $book->id,
                'rating' => 4,
                'content' => 'Another review',
            ]);

            $response->assertSessionHasErrors('book_id');
        });

        it('requires authentication', function () {
            $book = Book::factory()->create();

            $response = $this->post(route('reviews.store'), [
                'book_id' => $book->id,
                'rating' => 5,
                'content' => 'Great book!',
            ]);

            $response->assertRedirect(route('login'));
        });

        it('validates required fields', function () {
            $user = User::factory()->create();

            $response = $this->actingAs($user)->post(route('reviews.store'), []);

            $response->assertSessionHasErrors(['book_id', 'rating', 'content']);
        });

        it('validates rating is between 1 and 5', function () {
            $user = User::factory()->create();
            $book = Book::factory()->create();

            $response = $this->actingAs($user)->post(route('reviews.store'), [
                'book_id' => $book->id,
                'rating' => 6,
                'content' => 'Invalid rating',
            ]);

            $response->assertSessionHasErrors('rating');
        });
    });

    describe('update', function () {
        it('allows user to update their own review', function () {
            $user = User::factory()->create();
            $review = Review::factory()->create(['user_id' => $user->id]);

            $response = $this->actingAs($user)->patch(route('reviews.update', $review), [
                'rating' => 4,
                'content' => 'Updated review',
            ]);

            $response->assertRedirect(route('reviews.show', $review));

            $this->assertDatabaseHas('reviews', [
                'id' => $review->id,
                'rating' => 4,
                'content' => 'Updated review',
            ]);
        });

        it('prevents user from updating other user reviews', function () {
            $user1 = User::factory()->create();
            $user2 = User::factory()->create();
            $review = Review::factory()->create(['user_id' => $user1->id]);

            $response = $this->actingAs($user2)->patch(route('reviews.update', $review), [
                'rating' => 1,
                'content' => 'Hacked review',
            ]);

            $response->assertForbidden();
        });

        it('requires authentication', function () {
            $review = Review::factory()->create();

            $response = $this->patch(route('reviews.update', $review), [
                'rating' => 5,
            ]);

            $response->assertRedirect(route('login'));
        });
    });

    describe('destroy', function () {
        it('allows user to delete their own review', function () {
            $user = User::factory()->create();
            $review = Review::factory()->create(['user_id' => $user->id]);

            $response = $this->actingAs($user)->delete(route('reviews.destroy', $review));

            $response->assertRedirect(route('reviews.index'));
            $this->assertDatabaseMissing('reviews', ['id' => $review->id]);
        });

        it('prevents user from deleting other user reviews', function () {
            $user1 = User::factory()->create();
            $user2 = User::factory()->create();
            $review = Review::factory()->create(['user_id' => $user1->id]);

            $response = $this->actingAs($user2)->delete(route('reviews.destroy', $review));

            $response->assertForbidden();
            $this->assertDatabaseHas('reviews', ['id' => $review->id]);
        });

        it('requires authentication', function () {
            $review = Review::factory()->create();

            $response = $this->delete(route('reviews.destroy', $review));

            $response->assertRedirect(route('login'));
        });
    });
});
