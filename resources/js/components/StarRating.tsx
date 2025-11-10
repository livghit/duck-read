import { cn } from '@/lib/utils';
import { Star } from 'lucide-react';
import React from 'react';

interface StarRatingProps {
    rating: number;
    onRatingChange?: (rating: number) => void;
    readOnly?: boolean;
    size?: 'sm' | 'md' | 'lg';
    className?: string;
}

export default function StarRating({
    rating,
    onRatingChange,
    readOnly = false,
    size = 'md',
    className,
}: StarRatingProps) {
    const [hoverRating, setHoverRating] = React.useState<number | null>(null);

    const sizeClasses = {
        sm: 'size-3.5',
        md: 'size-4',
        lg: 'size-5',
    };

    const displayRating = hoverRating ?? rating;

    return (
        <div className={cn('flex gap-1', className)}>
            {[1, 2, 3, 4, 5].map((star) => (
                <button
                    key={star}
                    type="button"
                    disabled={readOnly}
                    onClick={() => !readOnly && onRatingChange?.(star)}
                    onMouseEnter={() => !readOnly && setHoverRating(star)}
                    onMouseLeave={() => !readOnly && setHoverRating(null)}
                    className={cn(
                        'transition-colors',
                        !readOnly && 'cursor-pointer hover:text-yellow-400',
                        readOnly && 'cursor-default',
                    )}
                >
                    <Star
                        className={cn(
                            sizeClasses[size],
                            displayRating >= star
                                ? 'fill-yellow-400 text-yellow-400'
                                : 'text-muted-foreground',
                        )}
                    />
                </button>
            ))}
        </div>
    );
}
