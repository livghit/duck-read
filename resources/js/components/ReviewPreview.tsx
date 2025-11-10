import { Card, CardContent, CardHeader } from '@/components/ui/card';
import StarRating from './StarRating';

interface ReviewPreviewProps {
    review: {
        id: string | number;
        book?: {
            title: string;
            author: string;
            cover_url?: string | null;
        };
        rating: number;
        content: string;
        user?: {
            name: string;
        };
        created_at?: string;
    };
    onEdit?: () => void;
    onDelete?: () => void;
    isOwner?: boolean;
    className?: string;
}

export default function ReviewPreview({
    review,
    onEdit,
    onDelete,
    isOwner = false,
    className,
}: ReviewPreviewProps) {
    const contentPreview = review.content.slice(0, 200);
    const isLongContent = review.content.length > 200;

    return (
        <Card className={className}>
            <CardHeader className="pb-3">
                <div className="space-y-2">
                    {review.book && (
                        <div>
                            <h3 className="text-sm font-semibold">
                                {review.book.title}
                            </h3>
                            <p className="text-xs text-muted-foreground">
                                {review.book.author}
                            </p>
                        </div>
                    )}
                    <div className="flex items-center justify-between">
                        <StarRating rating={review.rating} readOnly size="sm" />
                        {review.user && (
                            <span className="text-xs text-muted-foreground">
                                by {review.user.name}
                            </span>
                        )}
                    </div>
                    {review.created_at && (
                        <p className="text-xs text-muted-foreground">
                            {new Date(review.created_at).toLocaleDateString()}
                        </p>
                    )}
                </div>
            </CardHeader>

            <CardContent className="space-y-3">
                <p className="text-sm leading-relaxed text-foreground/90">
                    {contentPreview}
                    {isLongContent && '...'}
                </p>

                {isOwner && (onEdit || onDelete) && (
                    <div className="flex gap-2 pt-2">
                        {onEdit && (
                            <button
                                onClick={onEdit}
                                className="text-xs font-medium text-primary hover:underline"
                            >
                                Edit
                            </button>
                        )}
                        {onDelete && (
                            <button
                                onClick={onDelete}
                                className="text-xs font-medium text-destructive hover:underline"
                            >
                                Delete
                            </button>
                        )}
                    </div>
                )}
            </CardContent>
        </Card>
    );
}
