<?php

namespace App\Http\Controllers;

use App\Http\Requests\StoreReviewRequest;
use App\Http\Requests\StoreToReviewRequest;
use App\Models\ToReviewList;
use Illuminate\Http\JsonResponse;

class ToReviewListController extends Controller
{
    public function index(): JsonResponse
    {
        $items = auth()->user()->toReviewLists()->with('book')->pending()->get();

        return response()->json([
            'data' => $items,
        ]);
    }

    public function store(StoreToReviewRequest $request): JsonResponse
    {
        // Check if already in to-review list
        $existing = ToReviewList::where('user_id', auth()->id())
            ->where('book_id', $request->validated('book_id'))
            ->first();

        if ($existing) {
            return response()->json([
                'error' => 'Book is already in your to-review list.',
            ], 422);
        }

        $item = auth()->user()->toReviewLists()->create($request->validated());

        return response()->json([
            'data' => $item->load('book'),
        ], 201);
    }

    public function destroy(ToReviewList $toReviewList): JsonResponse
    {
        $this->authorize('delete', $toReviewList);

        $toReviewList->delete();

        return response()->json(null, 204);
    }

    public function markReviewed(ToReviewList $toReviewList, StoreReviewRequest $request): JsonResponse
    {
        $this->authorize('update', $toReviewList);

        // Create the review
        $review = auth()->user()->reviews()->create([
            'book_id' => $toReviewList->book_id,
            'rating' => $request->validated('rating'),
            'content' => $request->validated('content'),
        ]);

        // Remove from to-review list
        $toReviewList->delete();

        return response()->json([
            'data' => $review->load('book'),
        ], 201);
    }
}
