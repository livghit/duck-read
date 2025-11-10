import BookCard from '@/components/BookCard';
import { ErrorState, NoResultsState } from '@/components/EmptyState';
import SearchInput from '@/components/SearchInput';
import { LoadingGrid } from '@/components/Skeletons';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head, router } from '@inertiajs/react';
import { useState } from 'react';

interface Book {
    id: string | number;
    title: string;
    author: string;
    cover_url?: string | null;
    isbn?: string;
}

interface BooksSearchProps {
    results?: Book[];
    query?: string;
}

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Books',
        href: '/books/search',
    },
];

export default function BooksSearch({
    results = [],
    query = '',
}: BooksSearchProps) {
    const [searchQuery, setSearchQuery] = useState(query);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const handleSearch = async () => {
        if (!searchQuery.trim()) return;

        setIsLoading(true);
        setError(null);

        try {
            router.get(
                '/books/search',
                { query: searchQuery },
                {
                    onError: () => {
                        setError('Failed to search books. Please try again.');
                        setIsLoading(false);
                    },
                    onFinish: () => {
                        setIsLoading(false);
                    },
                },
            );
        } catch {
            setError('Something went wrong. Please try again.');
            setIsLoading(false);
        }
    };

    const handleBookClick = (book: Book) => {
        router.visit(`/books/${book.id}`);
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Search Books" />

            <div className="flex flex-1 flex-col gap-6 overflow-x-auto rounded-xl p-4">
                <div className="space-y-2">
                    <h1 className="text-3xl font-bold">Search Books</h1>
                    <p className="text-sm text-muted-foreground">
                        Find and add books to your collection
                    </p>
                </div>

                <SearchInput
                    value={searchQuery}
                    onChange={setSearchQuery}
                    onSearch={handleSearch}
                    isLoading={isLoading}
                    placeholder="Search by title or author..."
                />

                {error && (
                    <ErrorState
                        title="Search Error"
                        description={error}
                        onRetry={handleSearch}
                    />
                )}

                {isLoading ? (
                    <LoadingGrid count={6} />
                ) : results.length > 0 ? (
                    <>
                        <div className="text-sm text-muted-foreground">
                            Found {results.length} book
                            {results.length !== 1 ? 's' : ''}
                        </div>
                        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                            {results.map((book) => (
                                <BookCard
                                    key={book.id}
                                    book={book}
                                    onClick={() => handleBookClick(book)}
                                />
                            ))}
                        </div>
                    </>
                ) : searchQuery ? (
                    <NoResultsState />
                ) : (
                    <div className="py-12 text-center">
                        <p className="text-sm text-muted-foreground">
                            Enter a book title or author name to search
                        </p>
                    </div>
                )}
            </div>
        </AppLayout>
    );
}
