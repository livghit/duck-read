import BookCard from '@/components/BookCard';
import { NoToReviewState } from '@/components/EmptyState';
import { Button } from '@/components/ui/button';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head, router } from '@inertiajs/react';
import { Trash2 } from 'lucide-react';

interface Book {
    id: string | number;
    title: string;
    author: string;
    cover_url?: string | null;
    isbn?: string;
}

interface ToReviewListItem {
    id: string | number;
    book: Book;
    added_at: string;
}

interface ToReviewListIndexProps {
    items: ToReviewListItem[];
}

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'To-Review List',
        href: '/to-review-lists',
    },
];

export default function ToReviewListIndex({ items }: ToReviewListIndexProps) {
    const handleRemove = (itemId: string | number) => {
        if (confirm('Remove this book from your to-review list?')) {
            router.delete(`/to-review-lists/${itemId}`);
        }
    };

    const handleMarkReviewed = (itemId: string | number) => {
        router.post(`/to-review-lists/${itemId}/mark-reviewed`);
    };

    const handleViewBook = (book: Book) => {
        router.visit(`/books/${book.id}`);
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="To-Review List" />

            <div className="flex flex-1 flex-col gap-6 overflow-x-auto rounded-xl p-4">
                <div className="space-y-2">
                    <h1 className="text-3xl font-bold">To-Review List</h1>
                    <p className="text-sm text-muted-foreground">
                        {items.length} book{items.length !== 1 ? 's' : ''}{' '}
                        waiting for your review
                    </p>
                </div>

                <div className="flex justify-end">
                    <Button
                        variant="outline"
                        onClick={() => router.visit('/books/search')}
                    >
                        Add More Books
                    </Button>
                </div>

                {items.length > 0 ? (
                    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                        {items.map((item) => (
                            <div key={item.id} className="group relative">
                                <BookCard
                                    book={item.book}
                                    onClick={() => handleViewBook(item.book)}
                                />

                                {/* Actions Overlay */}
                                <div className="absolute inset-0 flex items-center justify-center gap-2 rounded-lg bg-black/50 p-2 opacity-0 transition-opacity group-hover:opacity-100">
                                    <Button
                                        size="sm"
                                        variant="secondary"
                                        onClick={() =>
                                            handleMarkReviewed(item.id)
                                        }
                                    >
                                        Mark Reviewed
                                    </Button>
                                    <Button
                                        size="sm"
                                        variant="destructive"
                                        onClick={() => handleRemove(item.id)}
                                    >
                                        <Trash2 className="size-4" />
                                    </Button>
                                </div>

                                {/* Date Added */}
                                <p className="mt-2 text-center text-xs text-muted-foreground">
                                    Added{' '}
                                    {new Date(
                                        item.added_at,
                                    ).toLocaleDateString()}
                                </p>
                            </div>
                        ))}
                    </div>
                ) : (
                    <NoToReviewState
                        onAddClick={() => router.visit('/books/search')}
                    />
                )}
            </div>
        </AppLayout>
    );
}
