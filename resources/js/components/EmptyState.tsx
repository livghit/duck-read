import { cn } from '@/lib/utils';
import React from 'react';

interface EmptyStateProps {
    icon?: React.ReactNode;
    title: string;
    description?: string;
    action?: {
        label: string;
        onClick: () => void;
    };
    className?: string;
}

export function EmptyState({
    icon,
    title,
    description,
    action,
    className,
}: EmptyStateProps) {
    return (
        <div
            className={cn(
                'flex flex-col items-center justify-center px-4 py-12 text-center',
                className,
            )}
        >
            {icon && <div className="mb-4 text-muted-foreground">{icon}</div>}
            <h3 className="mb-2 text-lg font-semibold">{title}</h3>
            {description && (
                <p className="mb-6 max-w-sm text-sm text-muted-foreground">
                    {description}
                </p>
            )}
            {action && (
                <button
                    onClick={action.onClick}
                    className="text-sm font-medium text-primary hover:underline"
                >
                    {action.label}
                </button>
            )}
        </div>
    );
}

export function NoResultsState() {
    return (
        <EmptyState
            title="No results found"
            description="Try adjusting your search criteria or browse all books"
        />
    );
}

export function NoReviewsState({
    onCreateClick,
}: {
    onCreateClick?: () => void;
}) {
    return (
        <EmptyState
            title="No reviews yet"
            description="Start reviewing books to share your thoughts"
            action={
                onCreateClick
                    ? { label: 'Write a review', onClick: onCreateClick }
                    : undefined
            }
        />
    );
}

export function NoToReviewState({ onAddClick }: { onAddClick?: () => void }) {
    return (
        <EmptyState
            title="Your to-review list is empty"
            description="Add books you want to read to your list"
            action={
                onAddClick
                    ? { label: 'Browse books', onClick: onAddClick }
                    : undefined
            }
        />
    );
}

export function ErrorState({
    title = 'Something went wrong',
    description = 'Please try again later',
    onRetry,
}: {
    title?: string;
    description?: string;
    onRetry?: () => void;
}) {
    return (
        <EmptyState
            title={title}
            description={description}
            action={
                onRetry ? { label: 'Try again', onClick: onRetry } : undefined
            }
        />
    );
}
