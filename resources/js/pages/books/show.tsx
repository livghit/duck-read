import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head, router } from '@inertiajs/react';
import {
    BookOpen,
    Calendar,
    Globe,
    Hash,
    Languages,
    Library,
    Star,
    Users,
} from 'lucide-react';
import { useState } from 'react';

interface Book {
    id: string | number;
    title: string;
    subtitle?: string | null;
    author: string;
    description?: string | null;
    cover_url?: string | null;
    isbn?: string;
    published_year?: number;
    first_publish_date?: string | null;
    publisher?: string;
    subjects?: string[] | null;
    excerpt?: string | null;
    links?: Array<{ title: string; url: string }> | null;
    number_of_pages?: number | null;
    languages?: string[] | null;
    edition_count?: number | null;
    ratings_average?: number | null;
    ratings_count?: number | null;
}

interface BooksShowProps {
    book: Book;
    userReview?: {
        id: string | number;
        rating: number;
    };
    isInToReviewList?: boolean;
}

export default function BooksShow({
    book,
    userReview,
    isInToReviewList = false,
}: BooksShowProps) {
    const [isAddingToList, setIsAddingToList] = useState(false);
    const [isRemovingFromList, setIsRemovingFromList] = useState(false);

    const breadcrumbs: BreadcrumbItem[] = [
        {
            title: 'Books',
            href: '/books/search',
        },
        {
            title: book.title,
            href: `/books/${book.id}`,
        },
    ];

    const handleAddToReviewList = async () => {
        setIsAddingToList(true);
        try {
            router.post(
                '/to-review-lists',
                { book_id: book.id },
                {
                    onError: () => {
                        setIsAddingToList(false);
                    },
                },
            );
        } catch {
            setIsAddingToList(false);
        }
    };

    const handleRemoveFromReviewList = async () => {
        setIsRemovingFromList(true);
        try {
            router.delete(`/to-review-lists/${book.id}`, {
                onError: () => {
                    setIsRemovingFromList(false);
                },
            });
        } catch {
            setIsRemovingFromList(false);
        }
    };

    const handleWriteReview = () => {
        if (userReview) {
            router.visit(`/reviews/${userReview.id}/edit`);
        } else {
            router.visit(`/reviews/create?book_id=${book.id}`);
        }
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title={book.title} />

            <div className="flex flex-1 flex-col gap-6 overflow-x-auto rounded-xl p-4">
                <div className="grid grid-cols-1 gap-8 md:grid-cols-4">
                    {/* Book Cover */}
                    <div className="md:col-span-1">
                        <div className="sticky top-4">
                            <div className="relative aspect-[2/3] w-full overflow-hidden rounded-lg shadow-lg">
                                <img
                                    src={(function () {
                                        const placeholder =
                                            'https://placehold.co/600x900?text=No%20Cover';
                                        const url = book.cover_url ?? '';
                                        if (!url) return placeholder;
                                        if (url.includes('placeholder.com'))
                                            return placeholder;
                                        return url;
                                    })()}
                                    alt={book.title}
                                    className="h-full w-full object-cover"
                                    onError={(e) => {
                                        const img =
                                            e.currentTarget as HTMLImageElement;
                                        if (
                                            (img as any).dataset.fallbackApplied
                                        )
                                            return;
                                        (img as any).dataset.fallbackApplied =
                                            'true';
                                        img.src =
                                            'https://placehold.co/600x900?text=No%20Cover';
                                    }}
                                />
                            </div>

                            {/* Quick Stats Card */}
                            {(book.ratings_average ||
                                book.edition_count ||
                                book.number_of_pages) && (
                                <Card className="mt-4">
                                    <CardContent className="space-y-3 pt-6">
                                        {book.ratings_average && (
                                            <div className="flex items-center justify-between">
                                                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                                    <Star className="h-4 w-4" />
                                                    <span>Rating</span>
                                                </div>
                                                <div className="flex items-center gap-1">
                                                    <span className="font-semibold">
                                                        {book.ratings_average.toFixed(
                                                            1,
                                                        )}
                                                    </span>
                                                    {book.ratings_count && (
                                                        <span className="text-sm text-muted-foreground">
                                                            (
                                                            {book.ratings_count}
                                                            )
                                                        </span>
                                                    )}
                                                </div>
                                            </div>
                                        )}
                                        {book.edition_count &&
                                            book.edition_count > 1 && (
                                                <div className="flex items-center justify-between">
                                                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                                        <Library className="h-4 w-4" />
                                                        <span>Editions</span>
                                                    </div>
                                                    <span className="font-semibold">
                                                        {book.edition_count}
                                                    </span>
                                                </div>
                                            )}
                                        {book.number_of_pages && (
                                            <div className="flex items-center justify-between">
                                                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                                    <BookOpen className="h-4 w-4" />
                                                    <span>Pages</span>
                                                </div>
                                                <span className="font-semibold">
                                                    {book.number_of_pages}
                                                </span>
                                            </div>
                                        )}
                                    </CardContent>
                                </Card>
                            )}
                        </div>
                    </div>

                    {/* Book Details */}
                    <div className="space-y-6 md:col-span-3">
                        <div>
                            <h1 className="mb-2 text-4xl font-bold">
                                {book.title}
                            </h1>
                            {book.subtitle && (
                                <h2 className="mb-3 text-2xl text-muted-foreground">
                                    {book.subtitle}
                                </h2>
                            )}
                            <p className="flex items-center gap-2 text-xl text-muted-foreground">
                                <Users className="h-5 w-5" />
                                {book.author}
                            </p>
                        </div>

                        {/* Actions */}
                        <div className="flex flex-wrap gap-3">
                            <Button onClick={handleWriteReview}>
                                {userReview ? 'Edit Review' : 'Write a Review'}
                            </Button>
                            {isInToReviewList ? (
                                <Button
                                    variant="outline"
                                    onClick={handleRemoveFromReviewList}
                                    disabled={isRemovingFromList}
                                >
                                    {isRemovingFromList
                                        ? 'Removing...'
                                        : 'Remove from List'}
                                </Button>
                            ) : (
                                <Button
                                    variant="outline"
                                    onClick={handleAddToReviewList}
                                    disabled={isAddingToList}
                                >
                                    {isAddingToList
                                        ? 'Adding...'
                                        : 'Add to Review List'}
                                </Button>
                            )}
                        </div>

                        <Separator />

                        {/* Description */}
                        {book.description && (
                            <div>
                                <h2 className="mb-3 text-2xl font-semibold">
                                    About this book
                                </h2>
                                <p className="text-base leading-relaxed whitespace-pre-line text-foreground/90">
                                    {book.description}
                                </p>
                            </div>
                        )}

                        {/* Excerpt */}
                        {book.excerpt && (
                            <div>
                                <h2 className="mb-3 text-2xl font-semibold">
                                    Excerpt
                                </h2>
                                <blockquote className="border-l-4 border-primary/30 bg-muted/50 p-4 italic">
                                    <p className="text-base leading-relaxed text-foreground/90">
                                        {book.excerpt}
                                    </p>
                                </blockquote>
                            </div>
                        )}

                        {/* Subjects/Categories */}
                        {book.subjects && book.subjects.length > 0 && (
                            <div>
                                <h2 className="mb-3 text-2xl font-semibold">
                                    Categories & Subjects
                                </h2>
                                <div className="flex flex-wrap gap-2">
                                    {book.subjects
                                        .slice(0, 20)
                                        .map((subject) => (
                                            <Badge
                                                key={subject}
                                                variant="secondary"
                                                className="text-sm"
                                            >
                                                {subject}
                                            </Badge>
                                        ))}
                                    {book.subjects.length > 20 && (
                                        <Badge
                                            variant="outline"
                                            className="text-sm"
                                        >
                                            +{book.subjects.length - 20} more
                                        </Badge>
                                    )}
                                </div>
                            </div>
                        )}

                        <Separator />

                        {/* Publication Details */}
                        <div>
                            <h2 className="mb-4 text-2xl font-semibold">
                                Publication Details
                            </h2>
                            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                                {book.isbn && (
                                    <div className="flex items-start gap-3">
                                        <Hash className="mt-1 h-4 w-4 text-muted-foreground" />
                                        <div>
                                            <p className="text-sm font-medium text-muted-foreground">
                                                ISBN
                                            </p>
                                            <p className="font-mono text-sm">
                                                {book.isbn}
                                            </p>
                                        </div>
                                    </div>
                                )}
                                {book.publisher && (
                                    <div className="flex items-start gap-3">
                                        <Library className="mt-1 h-4 w-4 text-muted-foreground" />
                                        <div>
                                            <p className="text-sm font-medium text-muted-foreground">
                                                Publisher
                                            </p>
                                            <p className="text-sm">
                                                {book.publisher}
                                            </p>
                                        </div>
                                    </div>
                                )}
                                {(book.first_publish_date ||
                                    book.published_year) && (
                                    <div className="flex items-start gap-3">
                                        <Calendar className="mt-1 h-4 w-4 text-muted-foreground" />
                                        <div>
                                            <p className="text-sm font-medium text-muted-foreground">
                                                First Published
                                            </p>
                                            <p className="text-sm">
                                                {book.first_publish_date ||
                                                    book.published_year}
                                            </p>
                                        </div>
                                    </div>
                                )}
                                {book.languages &&
                                    book.languages.length > 0 && (
                                        <div className="flex items-start gap-3">
                                            <Languages className="mt-1 h-4 w-4 text-muted-foreground" />
                                            <div>
                                                <p className="text-sm font-medium text-muted-foreground">
                                                    Languages
                                                </p>
                                                <div className="flex flex-wrap gap-1">
                                                    {book.languages.map(
                                                        (lang) => (
                                                            <Badge
                                                                key={lang}
                                                                variant="outline"
                                                                className="text-xs"
                                                            >
                                                                {lang.toUpperCase()}
                                                            </Badge>
                                                        ),
                                                    )}
                                                </div>
                                            </div>
                                        </div>
                                    )}
                            </div>
                        </div>

                        {/* External Links */}
                        {book.links && book.links.length > 0 && (
                            <div>
                                <h2 className="mb-3 text-2xl font-semibold">
                                    External Resources
                                </h2>
                                <div className="space-y-2">
                                    {book.links.map((link, index) => (
                                        <a
                                            key={index}
                                            href={link.url}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="flex items-center gap-2 text-sm text-primary hover:underline"
                                        >
                                            <Globe className="h-4 w-4" />
                                            {link.title || link.url}
                                        </a>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </AppLayout>
    );
}
