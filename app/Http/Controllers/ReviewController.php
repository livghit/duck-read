<?php

namespace App\Http\Controllers;

use App\Http\Requests\StoreReviewRequest;
use App\Http\Requests\UpdateReviewRequest;
use App\Models\Book;
use App\Models\Review;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class ReviewController extends Controller
{
    public function index(): Response
    {
        $reviews = auth()->user()->reviews()
            ->with(['book', 'user:id,name'])
            ->latest()
            ->get();

        return Inertia::render('reviews/index', [
            'reviews' => $reviews,
            'currentUserId' => auth()->id(),
        ]);
    }

    public function create(Request $request): Response
    {
        $books = Book::query()
            ->latest()
            ->limit(20)
            ->get(['id', 'title', 'author', 'cover_url']);

        $selectedBookId = $request->integer('book_id') ?: null;

        return Inertia::render('reviews/form', [
            'books' => $books,
            'selectedBookId' => $selectedBookId,
        ]);
    }

    public function store(StoreReviewRequest $request): RedirectResponse
    {
        $validated = $request->validated();

        $existingReview = Review::where('user_id', auth()->id())
            ->where('book_id', $validated['book_id'])
            ->first();

        if ($existingReview) {
            return back()->withErrors([
                'book_id' => 'You have already reviewed this book.',
            ]);
        }

        auth()->user()->reviews()->create($validated);

        // Remove any to-review list entries for this book/user now that it's reviewed
        auth()->user()->toReviewLists()->where('book_id', $validated['book_id'])->delete();

        return redirect()->route('reviews.index');
    }

    public function show(Review $review): Response
    {
        $this->authorize('view', $review);

        return Inertia::render('reviews/show', [
            'review' => $review->load('book'),
        ]);
    }

    public function edit(Review $review): Response
    {
        $this->authorize('update', $review);

        return Inertia::render('reviews/form', [
            'review' => $review,
            'book' => $review->book,
            'isEdit' => true,
        ]);
    }

    public function update(Review $review, UpdateReviewRequest $request): RedirectResponse
    {
        $this->authorize('update', $review);

        $review->update($request->validated());

        return redirect()->route('reviews.show', $review);
    }

    public function destroy(Review $review): RedirectResponse
    {
        $this->authorize('delete', $review);

        $review->delete();

        return redirect()->route('reviews.index');
    }
}
