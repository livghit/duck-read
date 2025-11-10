import MarkdownRenderer from '@/components/MarkdownRenderer';
import StarRating from '@/components/StarRating';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head, router, useForm } from '@inertiajs/react';
import React from 'react';

interface Book {
    id: string | number;
    title: string;
    author: string;
}

interface ReviewFormProps {
    book?: Book;
    review?: {
        id: string | number;
        book_id: string | number;
        rating: number;
        content: string;
    };
    isEdit?: boolean;
}

export default function ReviewForm({
    book,
    review,
    isEdit = false,
}: ReviewFormProps) {
    const { data, setData, post, patch, processing, errors } = useForm({
        book_id: review?.book_id ?? book?.id ?? '',
        rating: review?.rating ?? 0,
        content: review?.content ?? '',
    });

    const [preview, setPreview] = React.useState(false);

    const breadcrumbs: BreadcrumbItem[] = [
        {
            title: 'Reviews',
            href: '/reviews',
        },
        {
            title: isEdit ? 'Edit Review' : 'New Review',
            href: isEdit ? `/reviews/${review?.id}/edit` : '/reviews/create',
        },
    ];

    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        if (isEdit && review) {
            patch(`/reviews/${review.id}`);
        } else {
            post('/reviews');
        }
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title={isEdit ? 'Edit Review' : 'Write a Review'} />

            <div className="flex flex-1 flex-col gap-6 overflow-x-auto rounded-xl p-4">
                <div>
                    <h1 className="text-3xl font-bold">
                        {isEdit ? 'Edit Review' : 'Write a Review'}
                    </h1>
                    {book && (
                        <p className="mt-2 text-sm text-muted-foreground">
                            {book.title} by {book.author}
                        </p>
                    )}
                </div>

                <form onSubmit={handleSubmit} className="max-w-4xl space-y-6">
                    {/* Rating */}
                    <div className="space-y-2">
                        <label className="text-sm font-medium">Rating</label>
                        <div className="flex items-center gap-4">
                            <StarRating
                                rating={data.rating}
                                onRatingChange={(rating) =>
                                    setData('rating', rating)
                                }
                            />
                            <span className="text-sm text-muted-foreground">
                                {data.rating > 0
                                    ? `${data.rating}/5 stars`
                                    : 'Select a rating'}
                            </span>
                        </div>
                        {errors.rating && (
                            <p className="text-sm text-destructive">
                                {errors.rating}
                            </p>
                        )}
                    </div>

                    {/* Content Editor */}
                    <div className="space-y-2">
                        <div className="flex items-center justify-between">
                            <label
                                htmlFor="content"
                                className="text-sm font-medium"
                            >
                                Your Review
                            </label>
                            <button
                                type="button"
                                onClick={() => setPreview(!preview)}
                                className="text-xs font-medium text-primary hover:underline"
                            >
                                {preview ? 'Edit' : 'Preview'}
                            </button>
                        </div>

                        {preview ? (
                            <Card>
                                <CardContent className="pt-6">
                                    {data.content ? (
                                        <MarkdownRenderer
                                            content={data.content}
                                        />
                                    ) : (
                                        <p className="text-sm text-muted-foreground italic">
                                            Your review preview will appear
                                            here...
                                        </p>
                                    )}
                                </CardContent>
                            </Card>
                        ) : (
                            <Textarea
                                id="content"
                                value={data.content}
                                onChange={(e) =>
                                    setData('content', e.target.value)
                                }
                                placeholder="Share your thoughts about this book... Supports markdown formatting."
                                className="min-h-[300px] font-mono text-sm"
                            />
                        )}
                        {errors.content && (
                            <p className="text-sm text-destructive">
                                {errors.content}
                            </p>
                        )}
                        <p className="text-xs text-muted-foreground">
                            Supports markdown: **bold**, *italic*, `code`,
                            links, etc.
                        </p>
                    </div>

                    {/* Actions */}
                    <div className="flex gap-3 pt-4">
                        <Button
                            type="submit"
                            disabled={processing || data.rating === 0}
                        >
                            {processing
                                ? 'Saving...'
                                : isEdit
                                  ? 'Update Review'
                                  : 'Publish Review'}
                        </Button>
                        <Button
                            type="button"
                            variant="outline"
                            onClick={() => router.visit('/reviews')}
                            disabled={processing}
                        >
                            Cancel
                        </Button>
                    </div>
                </form>
            </div>
        </AppLayout>
    );
}
