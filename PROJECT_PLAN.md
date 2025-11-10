# Lovedit: Personal Book Review Application - Detailed Project Plan

## Table of Contents

1. [Project Overview](#project-overview)
2. [Tech Stack Analysis](#tech-stack-analysis)
3. [Phase 1: Database & Models](#phase-1-database--models)
4. [Phase 2: External Integration](#phase-2-external-integration)
5. [Phase 3: Backend API Endpoints](#phase-3-backend-api-endpoints)
6. [Phase 4: Frontend Architecture](#phase-4-frontend-architecture)
7. [Phase 5: Core Pages Implementation](#phase-5-core-pages-implementation)
8. [Phase 6: UI/Navigation Updates](#phase-6-uinavigation-updates)
9. [Phase 7: Polish & Edge Cases](#phase-7-polish--edge-cases)
10. [Phase 8: Testing](#phase-8-testing)
11. [Phase 9: Final Steps](#phase-9-final-steps)
12. [File Structure Checklist](#file-structure-checklist)
13. [Key Technical Decisions](#key-technical-decisions)

---

## Project Overview

**Lovedit** is a personal book review webapp that allows users to:

- Search for books from a global database
- Review books with star ratings (1-5)
- Write detailed markdown-formatted reviews using Tiptap editor
- Maintain a "to-review" list for books to read later
- View all their reviews in a personalized library

**Stack:**

- Backend: Laravel 12.37 with SQLite
- Frontend: React 19 + Inertia.js v2
- Authentication: Laravel Fortify (pre-configured)
- Styling: Tailwind CSS v4
- Rich Text Editor: Tiptap v3.10.5
- Testing: Pest v4
- Type Safety: TypeScript + Wayfinder

---

## Tech Stack Analysis

### Installed & Ready to Use

| Package         | Version | Purpose                     |
| --------------- | ------- | --------------------------- |
| Laravel         | 12.37.0 | Backend framework           |
| Inertia.js      | 2.0.10  | Frontend-backend bridge     |
| React           | 19.2.0  | UI library                  |
| Tailwind CSS    | 4.1.12  | Styling                     |
| Tiptap          | 3.10.5  | Rich text editor (markdown) |
| Laravel Fortify | 1.31.2  | Authentication              |
| Pest            | 4.1.3   | Testing framework           |
| Wayfinder       | 0.1.12  | Type-safe route generation  |

### Existing Project Structure

```
app/
├── Models/User.php (auth ready)
├── Actions/Fortify/ (auth actions)
└── Http/Controllers/ (empty, ready for new)

resources/js/
├── Pages/ (auth pages + dashboard ready)
├── components/ (reusable UI + Tiptap already installed)
└── Types/ (TypeScript definitions)

database/
├── migrations/ (users table exists)
└── factories/ (UserFactory ready)

routes/
├── web.php (auth routes ready)
└── settings.php (settings routes)
```

---

## Phase 1: Database & Models

### Task 1.1: Create Database Migrations

**What to create:**
Three main tables with proper relationships and indexing.

**Books Table:**

- Stores global book metadata
- Can be populated from external API or manually
- Structure:
    ```
    id (primary key)
    title (string, indexed)
    author (string, indexed)
    description (text, nullable)
    isbn (string, unique, nullable)
    cover_url (string, nullable)
    external_id (string, unique, nullable) - for API reference
    published_year (year, nullable)
    publisher (string, nullable)
    timestamps
    ```

**Reviews Table:**

- User's personal reviews of books
- Foreign keys to both user and book
- Structure:

    ```
    id (primary key)
    user_id (foreign key → users)
    book_id (foreign key → books)
    rating (integer, 1-5, indexed)
    content (longtext) - markdown content
    created_at, updated_at

    Unique constraint: (user_id, book_id) - one review per user per book
    ```

**ToReviewList Table:**

- Books users want to review later
- Structure:

    ```
    id (primary key)
    user_id (foreign key → users)
    book_id (foreign key → books)
    added_at (timestamp)

    Unique constraint: (user_id, book_id) - prevent duplicates
    ```

**Migration Commands:**

```bash
php artisan make:migration create_books_table
php artisan make:migration create_reviews_table
php artisan make:migration create_to_review_lists_table
```

**Key Considerations:**

- Add indexes on frequently queried columns (title, author, user_id)
- Use proper foreign key constraints with cascade options
- Add soft deletes for reviews if deletion history needed (optional)
- Use nullable for optional fields

---

### Task 1.2: Create Eloquent Models

**Book Model:**

- Relationships: `hasMany('reviews')`, `hasMany('toReviewLists')`
- Methods: Search scope, popular scope
- Factories: Generate realistic book data

**Review Model:**

- Relationships: `belongsTo('user')`, `belongsTo('book')`
- Casts: rating as integer, timestamps as datetime
- Scopes: `byUser($user)`, `withHighestRating()`, `recent()`
- Methods: Access rating, check if markdown valid
- Factories: Generate with random books and ratings

**ToReviewList Model:**

- Relationships: `belongsTo('user')`, `belongsTo('book')`
- Scopes: `pending()`, `recent()`
- Factories: Generate for users

**User Model (Update):**

- Add relationships: `hasMany('reviews')`, `hasMany('toReviewLists')`

**Model Commands:**

```bash
php artisan make:model Book -mf
php artisan make:model Review -mf
php artisan make:model ToReviewList -mf
```

**Key Considerations:**

- Use constructor property promotion (PHP 8 style)
- Add proper type hints and return types
- Use casts() method instead of $casts property
- Create factories with realistic data (use Faker)

---

## Phase 2: External Integration

### Task 2.1: Book Search API Integration

**Decision: Use Open Library API (Recommended)**

- **Why:** Free, no API key needed, open source, good data coverage
- **Endpoint:** `https://openlibrary.org/search.json?title={title}&author={author}`
- **Alternative:** Google Books API (requires API key but richer data)

**Create BookSearchService:**

```php
// app/Services/BookSearchService.php

class BookSearchService
{
    public function search(string $query, ?string $author = null): array
    {
        // Call Open Library API
        // Cache results for 24 hours
        // Transform response to standardized format
        // Return array of books
    }

    public function getFromExternalId(string $externalId): ?array
    {
        // Fetch full book details from external API
    }
}
```

**Integration Points:**

- Call from `BookController@search`
- Cache responses using Laravel's cache
- Store frequently accessed books in DB to reduce API calls

**Key Considerations:**

- Handle API timeouts gracefully
- Rate limit API calls if needed
- Transform external format to app format
- Cache to reduce API load

---

## Phase 3: Backend API Endpoints

### Task 3.1: Book Endpoints

**BookController.php:**

```php
// GET /api/books/search
public function search(SearchBooksRequest $request)
{
    // Validated input: query (required), author (optional), limit, page
    // Call BookSearchService
    // Return paginated results
    // Include user's review if exists
}

// GET /api/books/{id}
public function show(Book $book)
{
    // Return book details with:
    // - Basic metadata
    // - User's review (if authenticated)
    // - Review count
    // - Average rating (optional)
}

// POST /api/books
public function store(StoreBookRequest $request)
{
    // Create new book from external API data
    // Return created book or existing if already in DB
    // Useful for storing frequently reviewed books
}
```

---

### Task 3.2: Review Endpoints

**ReviewController.php:**

```php
// GET /api/reviews
public function index(Request $request)
{
    // Return authenticated user's reviews
    // Paginate by 10-20 per page
    // Sort: newest first (default)
    // Include related book data
    // Filter by rating (optional query param)
}

// GET /api/reviews/{review}
public function show(Review $review)
{
    // Check authorization (user owns review)
    // Return review with book data
}

// POST /api/reviews
public function store(StoreReviewRequest $request)
{
    // Validate: rating (1-5), content (min 10 chars, max 10k)
    // Check if book exists or create from external API
    // Check if user already reviewed this book (prevent duplicates)
    // Create review
    // Remove from to-review list if exists
    // Return created review
}

// PATCH /api/reviews/{review}
public function update(Review $review, UpdateReviewRequest $request)
{
    // Check authorization
    // Validate same rules as store
    // Update review
    // Return updated review
}

// DELETE /api/reviews/{review}
public function destroy(Review $review)
{
    // Check authorization
    // Delete review
    // Return 204 No Content
}
```

---

### Task 3.3: To-Review List Endpoints

**ToReviewListController.php:**

```php
// GET /api/to-review
public function index()
{
    // Return authenticated user's to-review list
    // Include book data
    // Paginate or return all (usually small list)
}

// POST /api/to-review
public function store(StoreToReviewRequest $request)
{
    // Validate: book_id or external book data
    // Check if already in to-review list
    // Check if already reviewed (prevent adding if reviewed)
    // Create to-review list entry
    // Return created entry
}

// DELETE /api/to-review/{toReviewList}
public function destroy(ToReviewList $toReviewList)
{
    // Check authorization
    // Delete entry
    // Return 204 No Content
}

// PATCH /api/to-review/{toReviewList}/reviewed
public function markReviewed(ToReviewList $toReviewList, StoreReviewRequest $request)
{
    // Create review with provided data
    // Delete from to-review list
    // Return review and 204
}
```

---

### Task 3.4: Form Requests & Validation

**StoreReviewRequest.php:**

```php
// Rules:
// - book_id: required|exists:books,id
// - rating: required|integer|min:1|max:5
// - content: required|string|min:10|max:10000

// Custom messages for user-friendly feedback
```

**UpdateReviewRequest.php:**

```php
// Same rules as StoreReviewRequest
```

**SearchBooksRequest.php:**

```php
// Rules:
// - query: required|string|min:2|max:100
// - author: nullable|string|max:100
// - limit: nullable|integer|min:5|max:50
```

**Commands:**

```bash
php artisan make:request StoreReviewRequest
php artisan make:request UpdateReviewRequest
php artisan make:request SearchBooksRequest
```

---

## Phase 4: Frontend Architecture

### Task 4.1: Reusable Components

**StarRating.tsx**

- Props: `rating` (number, 0-5), `onRate` (callback, optional)
- Display: 5 stars, filled/half/empty based on rating
- Interactive: onClick to set rating (if callback provided)
- Readonly mode: display only

**BookCard.tsx**

- Props: `book` (object), `onReviewClick`, `onAddToListClick`
- Display: Cover image, title, author, year
- Actions: "Review" button, "Add to List" button
- Responsive: Stack on mobile, grid on desktop

**ReviewPreview.tsx**

- Props: `review` (object), `book` (object), `onEditClick`, `onDeleteClick`
- Display: Book title, rating stars, excerpt of content, date
- Actions: Edit and delete buttons (if owner)
- Truncate long content

**MarkdownRenderer.tsx**

- Props: `content` (markdown string)
- Render markdown as HTML
- Safe rendering (sanitize HTML)
- Support: bold, italic, lists, links, headings, code blocks

**SearchInput.tsx**

- Props: `onSearch` (callback), `placeholder`
- Features: Debounced input (300ms)
- Display: Search icon, clear button
- Loading state while searching

**LoadingState.tsx / Skeletons**

- Animated skeleton loaders for:
    - Book cards (3-4 per row)
    - Review list items
    - Book details
- Use pulsing animation

**EmptyState.tsx**

- Props: `title`, `description`, `icon`
- Centered, friendly messaging
- Call-to-action button

---

### Task 4.2: Pages Structure

```
resources/js/Pages/
├── Books/
│   ├── Search.tsx          (Browse and search all books)
│   └── Show.tsx            (Book detail, review options)
├── Reviews/
│   ├── Index.tsx           (List user's reviews)
│   ├── Create.tsx          (New review with Tiptap editor)
│   └── Edit.tsx            (Edit existing review)
└── ToReviewList/
    └── Index.tsx           (Books to review later)
```

**Route Structure:**

```php
// routes/web.php - Add to auth middleware group

Route::get('/books/search', 'BookController@search')->name('books.search');
Route::get('/books/{book}', 'BookController@show')->name('books.show');
Route::post('/books', 'BookController@store')->name('books.store');

Route::apiResource('/reviews', 'ReviewController');
Route::apiResource('/to-review', 'ToReviewListController');
Route::patch('/to-review/{toReviewList}/reviewed', 'ToReviewListController@markReviewed')
    ->name('to-review.mark-reviewed');
```

---

## Phase 5: Core Pages Implementation

### Task 5.1: Books Search Page (`/books/search`)

**Features:**

- Large search input with debouncing
- Filter options:
    - Search by title (main)
    - Search by author (optional)
- Results display:
    - Grid layout (2-3 columns on desktop, 1 on mobile)
    - BookCard component for each result
    - Load more / pagination
- Empty state when no results
- Loading skeleton while searching
- User's existing review indicator (if already reviewed)

**Interactions:**

- "Review Now" → Navigate to `/books/{id}` for quick review
- "Add to List" → POST to `/api/to-review`, show toast confirmation
- Book card click → Navigate to `/books/{id}` for detail view

---

### Task 5.2: Book Detail Page (`/books/{id}`)

**Features:**

- Book metadata display:
    - Large cover image
    - Title, author, year
    - ISBN, publisher
    - Description
    - External links (Open Library, etc.)
- Review section:
    - Show user's review if exists (rating + content preview)
    - "Edit Review" button if reviewed
    - "Review Now" button if not reviewed
    - "Add to To-Review List" button if not reviewed
- Related data (optional future):
    - Average rating across site
    - Number of reviews

**Interactions:**

- "Review Now" → Navigate to `/reviews/create?book_id={id}`
- "Edit Review" → Navigate to `/reviews/{review}/edit`
- "Add to List" → POST to `/api/to-review`, show success message

---

### Task 5.3: Review Editor Page (`/reviews/create` and `/reviews/{review}/edit`)

**Features:**

- Book selector (if creating new):
    - Search field with autocomplete
    - Display selected book info
- Star rating selector:
    - 5 interactive stars
    - Required field
    - Show selected rating number
- Tiptap markdown editor:
    - Full formatting toolbar:
        - Bold, Italic, Underline
        - H1, H2, H3 headings
        - Bullet list, Numbered list
        - Links, Images (optional)
        - Code block
        - Horizontal rule
    - Preview mode toggle to see markdown rendered
    - Character count
    - Min 10 chars, max 10,000 chars
    - Placeholder text: "Write your honest review..."
- Action buttons:
    - Save (POST/PATCH)
    - Cancel (back)
    - Save as draft (optional)
- Loading state on save
- Success message after save
- Error display if validation fails

**Initial State for Edit:**

- Pre-fill all fields from existing review
- Show book info as read-only

---

### Task 5.4: Reviews List Page (`/reviews`)

**Features:**

- List all user's reviews:
    - Each review shows: book cover, title, rating stars, excerpt, date
    - ReviewPreview component
- Sorting options:
    - Newest first (default)
    - Oldest first
    - Highest rating
    - Lowest rating
    - Book title (A-Z, Z-A)
- Filtering:
    - Filter by rating (all, 5-star, 4-star, etc.)
- Search:
    - Search within review titles/books
- Pagination:
    - Load 10 per page
    - Load more button or infinite scroll
- Actions per review:
    - Edit button → `/reviews/{id}/edit`
    - Delete button → Confirm dialog, then delete
    - View book → Navigate to `/books/{id}`
- Empty state if no reviews yet

---

### Task 5.5: To-Review List Page (`/to-review`)

**Features:**

- Display all books in to-review list
- For each book:
    - BookCard component (without review actions)
    - "Review Now" button → `/reviews/create?book_id={id}`
    - "Remove" button → DELETE `/api/to-review/{id}`, confirm dialog
- Sorting:
    - Newest added first (default)
    - Book title (A-Z)
- Empty state if no books
- Count badge in navigation
- No pagination needed (usually small list)

---

## Phase 6: UI/Navigation Updates

### Task 6.1: Sidebar Navigation

**Update app-sidebar.tsx or nav-main.tsx:**

- Add new sections:

    ```
    📚 Books
      └─ Search/Browse Books → /books/search

    ⭐ My Reviews
      └─ All Reviews → /reviews
      └─ Write Review → /reviews/create

    📖 To Review
      └─ Reading List → /to-review
    ```

- Active link highlighting
- Icon usage (consistent with existing)
- Mobile hamburger menu support (already existing)

**Navigation State:**

- Show "To-Review" count as badge (e.g., "📖 To Review (3)")
- Update dynamically when items added/removed

---

### Task 6.2: Inertia Links & Routing

**Use Wayfinder for type-safe routing:**

```typescript
import { show as bookShow } from '@/actions/BookController'

// In components:
<Link href={bookShow(bookId).url}>View Book</Link>

// Or get full route object:
const bookRoute = bookShow(bookId) // { url: "/books/1", method: "get" }
```

**Route Naming Convention:**

- All routes follow RESTful naming: `books.search`, `reviews.index`, etc.
- Named routes enable Wayfinder type generation

---

## Phase 7: Polish & Edge Cases

### Task 7.1: Loading States

**Implement for:**

- Book search (skeleton cards while loading)
- Review creation (disable button, show "Saving...")
- Review deletion (confirm dialog)
- To-review list updates (optimistic update)
- Book detail page (initial load)

**UI Patterns:**

- Skeleton loaders matching card layout
- Button disabled state with spinner
- Toast notifications for async actions

---

### Task 7.2: Error Handling

**Global Error Handling:**

- Catch API errors and show friendly messages
- Validation error display in forms
- Retry buttons for failed requests
- Fallback UI for missing images

**Specific Cases:**

- Network error → "Check your connection" message
- 404 Book not found → Redirect to search
- 403 Unauthorized review access → Redirect to reviews list
- Validation error → Show field-level errors
- Server error → Generic "Something went wrong" message

---

### Task 7.3: Empty States

**Create EmptyState component for:**

- No books found in search
- No reviews written yet
- Empty to-review list
- No search query entered yet

**Messaging:**

- Friendly, encouraging text
- Suggest next action (search, write review, etc.)
- Icon or illustration

---

### Task 7.4: Responsive Design

**Breakpoints (Tailwind):**

- Mobile: sm (640px)
- Tablet: md (768px), lg (1024px)
- Desktop: xl (1280px)

**Responsive Adjustments:**

- Book grid: 1 col mobile, 2-3 cols desktop
- Review list: Full width mobile, sidebar + content desktop
- Editor: Stack mobile, side-by-side desktop
- Images: Responsive sizes, lazy loading

---

## Phase 8: Testing

### Task 8.1: API Endpoint Tests

**BookController Tests:**

```php
// Search books
it('searches books successfully');
it('returns empty results for no matches');
it('validates search query');

// Show book
it('displays book with user review if exists');
it('displays book without user review');
it('returns 404 for non-existent book');
```

**ReviewController Tests:**

```php
// Index
it('lists user reviews only');
it('paginates reviews');
it('can filter by rating');

// Create
it('creates review successfully');
it('validates rating 1-5');
it('validates content length');
it('prevents duplicate reviews for same user/book');
it('removes from to-review list on creation');

// Update
it('updates review successfully');
it('prevents updating others reviews');

// Delete
it('deletes review successfully');
it('prevents deleting others reviews');
```

**ToReviewListController Tests:**

```php
// Create
it('adds book to to-review list');
it('prevents duplicate additions');
it('prevents adding already-reviewed books');

// Delete
it('removes from to-review list');
it('prevents deleting others entries');
```

---

### Task 8.2: Model Tests

**Book Model:**

```php
it('has many reviews');
it('has many to-review-list entries');
it('can search by title');
```

**Review Model:**

```php
it('belongs to user');
it('belongs to book');
it('validates rating range');
```

**User Model:**

```php
it('has many reviews');
it('has many to-review-list entries');
```

---

### Task 8.3: Browser Tests (Pest v4)

**Critical User Flows:**

```php
// Search and review
it('user can search for books and review one', function () {
    $user = User::factory()->create();

    $page = visit('/books/search')
        ->type('[data-test="search"]', 'The Great Gatsby')
        ->click('[data-test="search-btn"]')
        ->assertSee('The Great Gatsby')
        ->click('[data-test="review-btn"]')
        ->assertUrlIs('/reviews/create');

    $page->type('[data-test="rating"]', 5)
        ->type('[data-test="content"]', 'Amazing book!')
        ->click('[data-test="submit"]')
        ->assertSee('Review created successfully');
});

// Add to to-review list
it('user can add book to to-review list', function () {
    // Similar flow...
});

// View all reviews
it('user can view all their reviews', function () {
    // Similar flow...
});
```

---

## Phase 9: Final Steps

### Task 9.1: Code Quality

**Format Code:**

```bash
vendor/bin/pint --dirty
```

**Run All Tests:**

```bash
php artisan test
```

**Type Check (TypeScript):**

```bash
npm run build
```

**Check for Console Errors:**

- Run on local dev server
- Test in browser console (should be clean)

---

### Task 9.2: Build & Deployment

**Local Testing:**

```bash
npm run dev          # Watch mode for development
composer run dev    # If using Sail/Docker
```

**Production Build:**

```bash
npm run build       # Build JS assets
php artisan migrate # Run migrations
```

**Final Checklist:**

- [ ] All migrations run successfully
- [ ] All tests pass
- [ ] No TypeScript errors
- [ ] No console errors/warnings
- [ ] Responsive design tested on mobile
- [ ] All routes working
- [ ] Images loading correctly
- [ ] Forms validating properly
- [ ] Auth working (login/logout)
- [ ] Fortify features working

---

## File Structure Checklist

### Backend Files to Create

**Models:**

```
✅ app/Models/Book.php
✅ app/Models/Review.php
✅ app/Models/ToReviewList.php
✅ database/factories/BookFactory.php
✅ database/factories/ReviewFactory.php
✅ database/factories/ToReviewListFactory.php
```

**Controllers:**

```
✅ app/Http/Controllers/BookController.php
✅ app/Http/Controllers/ReviewController.php
✅ app/Http/Controllers/ToReviewListController.php
```

**Requests & Validation:**

```
✅ app/Http/Requests/StoreReviewRequest.php
✅ app/Http/Requests/UpdateReviewRequest.php
✅ app/Http/Requests/SearchBooksRequest.php
✅ app/Http/Requests/StoreToReviewRequest.php
```

**Services:**

```
✅ app/Services/BookSearchService.php
```

**Migrations:**

```
✅ database/migrations/????_??_??_??????_create_books_table.php
✅ database/migrations/????_??_??_??????_create_reviews_table.php
✅ database/migrations/????_??_??_??????_create_to_review_lists_table.php
```

**Tests:**

```
✅ tests/Feature/Http/Controllers/BookControllerTest.php
✅ tests/Feature/Http/Controllers/ReviewControllerTest.php
✅ tests/Feature/Http/Controllers/ToReviewListControllerTest.php
✅ tests/Feature/Models/ReviewTest.php
✅ tests/Feature/Models/BookTest.php
✅ tests/Browser/BookReviewFlowTest.php
```

---

### Frontend Files to Create

**Pages:**

```
✅ resources/js/Pages/Books/Search.tsx
✅ resources/js/Pages/Books/Show.tsx
✅ resources/js/Pages/Reviews/Index.tsx
✅ resources/js/Pages/Reviews/Create.tsx
✅ resources/js/Pages/Reviews/Edit.tsx
✅ resources/js/Pages/ToReviewList/Index.tsx
```

**Components:**

```
✅ resources/js/components/StarRating.tsx
✅ resources/js/components/BookCard.tsx
✅ resources/js/components/ReviewPreview.tsx
✅ resources/js/components/MarkdownRenderer.tsx
✅ resources/js/components/SearchInput.tsx
✅ resources/js/components/BookSkeleton.tsx
✅ resources/js/components/EmptyState.tsx
```

**Updated Components:**

```
✅ resources/js/components/nav-main.tsx (add new sections)
✅ resources/js/components/app-sidebar.tsx (update navigation)
```

---

## Key Technical Decisions

### Architecture Decisions

| Decision             | Why                                                       |
| -------------------- | --------------------------------------------------------- |
| **Tiptap v3.10.5**   | Already installed, excellent markdown support, extensible |
| **Tailwind v4**      | Latest utilities, v3 classes deprecated, use new syntax   |
| **Wayfinder Routes** | Type-safe routing, automatic sync with backend            |
| **Inertia Forms**    | Built-in validation feedback, error handling              |
| **SQLite**           | Suitable for personal projects, no setup needed           |
| **Pest v4**          | Browser testing, better DX than PHPUnit                   |
| **API Routes**       | RESTful design, clean separation of concerns              |

### Database Design Decisions

| Table            | Decision                           | Rationale                                      |
| ---------------- | ---------------------------------- | ---------------------------------------------- |
| **Books**        | Store externally sourced books     | Reduce API calls, enable offline functionality |
| **Reviews**      | User + Book unique constraint      | Prevent duplicate reviews per user per book    |
| **ToReviewList** | Separate table vs Review "pending" | Cleaner design, explicit user intent           |
| **Soft Deletes** | Not on reviews (keep simple)       | Simple deletion, no recovery needed            |

### Frontend Design Decisions

| Component             | Decision                        | Rationale                                      |
| --------------------- | ------------------------------- | ---------------------------------------------- |
| **StarRating**        | Reusable interactive + readonly | DRY principle, used in multiple places         |
| **Markdown Renderer** | Separate component              | Safe rendering, reusable across review display |
| **Form Component**    | Use Inertia's `<Form>`          | Built-in validation error handling             |
| **Routing**           | Named routes + Wayfinder        | Type safety, refactoring-friendly              |

---

## Implementation Order

**Recommended sequence to minimize dependencies:**

1. **Phase 1:** Database & Models (foundation)
2. **Phase 2:** Book Search Service (external integration)
3. **Phase 3:** API Endpoints (backend complete)
4. **Phase 4:** Reusable Components (UI building blocks)
5. **Phase 5:** Core Pages (main features)
6. **Phase 6:** Navigation Updates (UX polish)
7. **Phase 8:** Testing (quality assurance)
8. **Phase 7:** Polish & Edge Cases (refinement)
9. **Phase 9:** Final Steps (deployment ready)

---

## Notes for Implementation

- **Commits:** Make atomic commits for each phase with clear messages
- **Testing:** Write tests as you go, not at the end
- **Code Style:** Run `vendor/bin/pint` regularly
- **Type Safety:** Ensure TypeScript errors resolved before commits
- **Mobile First:** Always test responsive design
- **Accessibility:** Use semantic HTML, ARIA labels where needed
- **Performance:** Optimize images, lazy load components
- **Documentation:** Add PHPDoc to PHP, JSDoc to TypeScript

---

**Plan complete! Ready to begin implementation with Phase 1: Database & Models. 🚀**
