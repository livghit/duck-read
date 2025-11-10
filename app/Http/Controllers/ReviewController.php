<?php

namespace App\Http\Controllers;

use App\Http\Requests\StoreReviewRequest;
use App\Http\Requests\UpdateReviewRequest;
use App\Models\Review;
use Illuminate\Http\JsonResponse;

class ReviewController extends Controller
{
    public function index(): JsonResponse
    {
        $reviews = auth()->user()->reviews()->with('book')->latest()->get();

        return response()->json([
            'data' => $reviews,
        ]);
    }

    public function show(Review $review): JsonResponse
    {
        $this->authorize('view', $review);

        return response()->json([
            'data' => $review->load('book'),
        ]);
    }

    public function store(StoreReviewRequest $request): JsonResponse
    {
        // Check if user already reviewed this book
        $existingReview = Review::where('user_id', auth()->id())
            ->where('book_id', $request->validated('book_id'))
            ->first();

        if ($existingReview) {
            return response()->json([
                'error' => 'You have already reviewed this book.',
            ], 422);
        }

        $review = auth()->user()->reviews()->create($request->validated());

        return response()->json([
            'data' => $review->load('book'),
        ], 201);
    }

    public function update(Review $review, UpdateReviewRequest $request): JsonResponse
    {
        $this->authorize('update', $review);

        $review->update($request->validated());

        return response()->json([
            'data' => $review->load('book'),
        ]);
    }

    public function destroy(Review $review): JsonResponse
    {
        $this->authorize('delete', $review);

        $review->delete();

        return response()->json(null, 204);
    }
}
