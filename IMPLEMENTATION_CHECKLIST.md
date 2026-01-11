# Lovedit Implementation Checklist
nice

Quick reference checklist for implementation. Check items off as you complete them.

## Phase 1: Database & Models

### 1.1: Migrations
- [ ] Create `create_books_table` migration
  - Fields: id, title, author, description, isbn, cover_url, external_id, published_year, publisher, timestamps
  - Indexes: title, author, external_id (unique)
- [ ] Create `create_reviews_table` migration
  - Fields: id, user_id (FK), book_id (FK), rating, content, timestamps
  - Unique constraint: (user_id, book_id)
- [ ] Create `create_to_review_lists_table` migration
  - Fields: id, user_id (FK), book_id (FK), added_at
  - Unique constraint: (user_id, book_id)
- [ ] Run migrations: `php artisan migrate`

### 1.2: Models & Factories
- [ ] Create `Book` model with relationships
- [ ] Create `BookFactory` with realistic data
- [ ] Create `Review` model with relationships
- [ ] Create `ReviewFactory` with realistic data
- [ ] Create `ToReviewList` model with relationships
- [ ] Create `ToReviewListFactory` with realistic data

### 1.3: Update User Model
- [ ] Add `hasMany('reviews')` relationship
- [ ] Add `hasMany('toReviewLists')` relationship

---

## Phase 2: External Integration

### 2.1: Book Search Service
- [ ] Create `BookSearchService` class
  - [ ] Implement `search(query, author)` method
  - [ ] Implement `getFromExternalId(id)` method
  - [ ] Add caching (24 hours)
  - [ ] Handle API errors gracefully

---

## Phase 3: Backend API Endpoints

### 3.1: BookController
- [ ] Create controller
- [ ] Implement `search(Request)` endpoint
- [ ] Implement `show(Book)` endpoint
- [ ] Implement `store(Request)` endpoint

### 3.2: ReviewController
- [ ] Create controller
- [ ] Implement `index()` endpoint (list user reviews)
- [ ] Implement `show(Review)` endpoint
- [ ] Implement `store(StoreReviewRequest)` endpoint
- [ ] Implement `update(Review, UpdateReviewRequest)` endpoint
- [ ] Implement `destroy(Review)` endpoint

### 3.3: ToReviewListController
- [ ] Create controller
- [ ] Implement `index()` endpoint (list user's to-review)
- [ ] Implement `store(Request)` endpoint
- [ ] Implement `destroy(ToReviewList)` endpoint
- [ ] Implement `markReviewed(ToReviewList, StoreReviewRequest)` endpoint

### 3.4: Form Requests
- [ ] Create `StoreReviewRequest`
- [ ] Create `UpdateReviewRequest`
- [ ] Create `SearchBooksRequest`
- [ ] Create `StoreToReviewRequest`

### 3.5: Routes
- [ ] Add API routes for books, reviews, to-review
- [ ] Register routes in `routes/api.php` or `web.php`
- [ ] Test routes with Postman/insomnia

---

## Phase 4: Frontend Components

### 4.1: StarRating Component
- [ ] Create `StarRating.tsx`
  - [ ] Display 5 stars
  - [ ] Show rating value
  - [ ] Interactive mode (onClick to rate)
  - [ ] Readonly mode

### 4.2: BookCard Component
- [ ] Create `BookCard.tsx`
  - [ ] Display cover image
  - [ ] Show title, author, year
  - [ ] "Review" button
  - [ ] "Add to List" button
  - [ ] Responsive grid

### 4.3: ReviewPreview Component
- [ ] Create `ReviewPreview.tsx`
  - [ ] Show star rating
  - [ ] Display excerpt of content
  - [ ] Show date
  - [ ] Edit/Delete buttons (if owner)

### 4.4: MarkdownRenderer Component
- [ ] Create `MarkdownRenderer.tsx`
  - [ ] Render markdown as HTML
  - [ ] Support: bold, italic, lists, links, headings, code
  - [ ] Safe HTML rendering (sanitize)

### 4.5: SearchInput Component
- [ ] Create `SearchInput.tsx`
  - [ ] Debounced input (300ms)
  - [ ] Clear button
  - [ ] Loading state
  - [ ] Placeholder text

### 4.6: Loading & Empty States
- [ ] Create skeleton loaders for cards
- [ ] Create `EmptyState` component
- [ ] Use Tailwind animations for pulsing

---

## Phase 5: Frontend Pages

### 5.1: Books/Search Page
- [ ] Create `resources/js/Pages/Books/Search.tsx`
  - [ ] Search input with debouncing
  - [ ] Display book results as cards
  - [ ] Pagination/load more
  - [ ] Empty state
  - [ ] Loading skeleton

### 5.2: Books/Show Page
- [ ] Create `resources/js/Pages/Books/Show.tsx`
  - [ ] Display book metadata
  - [ ] Show user's review if exists
  - [ ] "Review Now" button
  - [ ] "Add to List" button
  - [ ] Book cover display

### 5.3: Reviews/Index Page
- [ ] Create `resources/js/Pages/Reviews/Index.tsx`
  - [ ] List user's reviews
  - [ ] Sorting options
  - [ ] Filtering by rating
  - [ ] Pagination
  - [ ] Edit/Delete actions
  - [ ] Empty state

### 5.4: Reviews/Create Page
- [ ] Create `resources/js/Pages/Reviews/Create.tsx`
  - [ ] Book selector/display
  - [ ] Star rating selector
  - [ ] Tiptap editor for markdown
  - [ ] Preview toggle
  - [ ] Save/Cancel buttons
  - [ ] Form validation

### 5.5: Reviews/Edit Page
- [ ] Create `resources/js/Pages/Reviews/Edit.tsx`
  - [ ] Pre-fill form with existing review
  - [ ] Star rating selector
  - [ ] Tiptap editor
  - [ ] Save/Cancel buttons

### 5.6: ToReviewList/Index Page
- [ ] Create `resources/js/Pages/ToReviewList/Index.tsx`
  - [ ] List books in to-review
  - [ ] "Review Now" button per book
  - [ ] "Remove" button per book
  - [ ] Sorting options
  - [ ] Empty state

---

## Phase 6: Navigation & Routing

### 6.1: Update Navigation
- [ ] Update `app-sidebar.tsx` with new sections
- [ ] Add Books → Search/Browse
- [ ] Add Reviews → My Reviews, Write Review
- [ ] Add To-Review → Reading List
- [ ] Add icons and styling
- [ ] Mobile menu support

### 6.2: Wayfinder Setup
- [ ] Generate Wayfinder types: `npm run dev`
- [ ] Update imports to use Wayfinder routes
- [ ] Test type-safe routing

---

## Phase 7: Polish & UX

### 7.1: Loading States
- [ ] Add skeleton loaders
- [ ] Disable buttons while loading
- [ ] Show spinners on async actions

### 7.2: Error Handling
- [ ] Display validation errors
- [ ] Network error messages
- [ ] Retry buttons for failed requests
- [ ] User-friendly error messages

### 7.3: Empty States
- [ ] No books found
- [ ] No reviews yet
- [ ] No to-review items
- [ ] Friendly messaging

### 7.4: Responsive Design
- [ ] Test on mobile (375px)
- [ ] Test on tablet (768px)
- [ ] Test on desktop (1280px)
- [ ] Touch-friendly buttons

---

## Phase 8: Testing

### 8.1: API Tests
- [ ] BookController tests
  - [ ] Search books
  - [ ] Show book
  - [ ] Create book
- [ ] ReviewController tests
  - [ ] List reviews
  - [ ] Create review
  - [ ] Update review
  - [ ] Delete review
  - [ ] Duplicate prevention
- [ ] ToReviewListController tests
  - [ ] Add to list
  - [ ] Remove from list
  - [ ] Mark as reviewed

### 8.2: Browser Tests
- [ ] Search and review flow
- [ ] Add to to-review list
- [ ] Edit review
- [ ] Delete review
- [ ] View all reviews

---

## Phase 9: Final Steps

### 9.1: Code Quality
- [ ] Run `vendor/bin/pint --dirty`
- [ ] Fix any formatting issues
- [ ] Check TypeScript: `npm run build`
- [ ] No console errors/warnings

### 9.2: Testing
- [ ] Run full test suite: `php artisan test`
- [ ] All tests passing
- [ ] No coverage gaps

### 9.3: Build
- [ ] Run `npm run build`
- [ ] No build errors
- [ ] Assets generated

### 9.4: Manual Testing
- [ ] [ ] Can search for books
- [ ] [ ] Can create review with stars and markdown
- [ ] [ ] Can add book to to-review list
- [ ] [ ] Can view all reviews
- [ ] [ ] Can edit review
- [ ] [ ] Can delete review
- [ ] [ ] Navigation works on mobile
- [ ] [ ] All pages load without errors
- [ ] [ ] Images display correctly
- [ ] [ ] Auth still works

---

## Files Summary

### Backend (28 files)
**Models (6):**
- [ ] `app/Models/Book.php`
- [ ] `app/Models/Review.php`
- [ ] `app/Models/ToReviewList.php`
- [ ] `database/factories/BookFactory.php`
- [ ] `database/factories/ReviewFactory.php`
- [ ] `database/factories/ToReviewListFactory.php`

**Controllers (3):**
- [ ] `app/Http/Controllers/BookController.php`
- [ ] `app/Http/Controllers/ReviewController.php`
- [ ] `app/Http/Controllers/ToReviewListController.php`

**Requests (4):**
- [ ] `app/Http/Requests/StoreReviewRequest.php`
- [ ] `app/Http/Requests/UpdateReviewRequest.php`
- [ ] `app/Http/Requests/SearchBooksRequest.php`
- [ ] `app/Http/Requests/StoreToReviewRequest.php`

**Services (1):**
- [ ] `app/Services/BookSearchService.php`

**Migrations (3):**
- [ ] `database/migrations/????_??_??_??????_create_books_table.php`
- [ ] `database/migrations/????_??_??_??????_create_reviews_table.php`
- [ ] `database/migrations/????_??_??_??????_create_to_review_lists_table.php`

**Tests (multiple):**
- [ ] BookController tests
- [ ] ReviewController tests
- [ ] ToReviewListController tests

**Updated:**
- [ ] `app/Models/User.php` (add relationships)

### Frontend (13 files)
**Pages (6):**
- [ ] `resources/js/Pages/Books/Search.tsx`
- [ ] `resources/js/Pages/Books/Show.tsx`
- [ ] `resources/js/Pages/Reviews/Index.tsx`
- [ ] `resources/js/Pages/Reviews/Create.tsx`
- [ ] `resources/js/Pages/Reviews/Edit.tsx`
- [ ] `resources/js/Pages/ToReviewList/Index.tsx`

**Components (7):**
- [ ] `resources/js/components/StarRating.tsx`
- [ ] `resources/js/components/BookCard.tsx`
- [ ] `resources/js/components/ReviewPreview.tsx`
- [ ] `resources/js/components/MarkdownRenderer.tsx`
- [ ] `resources/js/components/SearchInput.tsx`
- [ ] `resources/js/components/BookSkeleton.tsx`
- [ ] `resources/js/components/EmptyState.tsx`

**Updated:**
- [ ] `resources/js/components/app-sidebar.tsx`
- [ ] `resources/js/components/nav-main.tsx`

---

**Total: ~41 files to create/update**

✅ **Plan is ready! Time to build!**
