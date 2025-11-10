<?php

namespace App\Http\Controllers;

use App\Http\Requests\SearchBooksRequest;
use App\Models\Book;
use App\Services\BookSearchService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Inertia\Response;
use Inertia\ResponseFactory;

class BookController extends Controller
{
    public function __construct(private BookSearchService $searchService) {}

    public function search(SearchBooksRequest $request): JsonResponse
    {
        $query = $request->validated('query');
        $author = $request->validated('author');

        $results = $this->searchService->search($query, $author);

        return response()->json([
            'data' => $results,
        ]);
    }

    public function show(Book $book): JsonResponse
    {
        return response()->json([
            'data' => $book->load('reviews'),
        ]);
    }

    public function store(SearchBooksRequest $request): JsonResponse
    {
        // Check if book already exists by external_id or ISBN
        if ($request->validated('external_id')) {
            $existingBook = Book::where('external_id', $request->validated('external_id'))->first();
            if ($existingBook) {
                return response()->json(['data' => $existingBook], 200);
            }
        }

        // Create new book
        $book = Book::create($request->validated());

        return response()->json([
            'data' => $book,
        ], 201);
    }
}
