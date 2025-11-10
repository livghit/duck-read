import { NoReviewsState } from '@/components/EmptyState';
import ReviewPreview from '@/components/ReviewPreview';
import { Button } from '@/components/ui/button';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head, router } from '@inertiajs/react';

interface Review {
    id: string | number;
    rating: number;
    content: string;
    book: {
        id: string | number;
        title: string;
        author: string;
        cover_url?: string | null;
    };
    user: {
        id: string | number;
        name: string;
    };
    created_at: string;
}

interface ReviewsIndexProps {
    reviews: Review[];
    currentUserId: string | number;
}

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Reviews',
        href: '/reviews',
    },
];

export default function ReviewsIndex({
    reviews,
    currentUserId,
}: ReviewsIndexProps) {
    const handleDelete = (reviewId: string | number) => {
        if (confirm('Are you sure you want to delete this review?')) {
            router.delete(`/reviews/${reviewId}`);
        }
    };

    const handleEdit = (reviewId: string | number) => {
        router.visit(`/reviews/${reviewId}/edit`);
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Reviews" />

            <div className="flex flex-1 flex-col gap-6 overflow-x-auto rounded-xl p-4">
                <div className="space-y-2">
                    <h1 className="text-3xl font-bold">My Reviews</h1>
                    <p className="text-sm text-muted-foreground">
                        Share your thoughts on books you've read
                    </p>
                </div>

                <div className="flex justify-end">
                    <Button onClick={() => router.visit('/reviews/create')}>
                        Write a Review
                    </Button>
                </div>

                {reviews.length > 0 ? (
                    <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
                        {reviews.map((review) => (
                            <ReviewPreview
                                key={review.id}
                                review={review}
                                isOwner={review.user.id === currentUserId}
                                onEdit={() => handleEdit(review.id)}
                                onDelete={
                                    review.user.id === currentUserId
                                        ? () => handleDelete(review.id)
                                        : undefined
                                }
                            />
                        ))}
                    </div>
                ) : (
                    <NoReviewsState
                        onCreateClick={() => router.visit('/reviews/create')}
                    />
                )}
            </div>
        </AppLayout>
    );
}
