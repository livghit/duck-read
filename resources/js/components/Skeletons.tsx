import { cn } from '@/lib/utils';

interface SkeletonProps {
    className?: string;
}

export function Skeleton({ className }: SkeletonProps) {
    return (
        <div className={cn('animate-pulse rounded-md bg-muted', className)} />
    );
}

export function BookCardSkeleton() {
    return (
        <div className="overflow-hidden rounded-lg border border-border">
            <Skeleton className="aspect-[2/3] w-full" />
            <div className="space-y-2 p-3">
                <Skeleton className="h-4 w-3/4" />
                <Skeleton className="h-3 w-1/2" />
                <div className="border-t border-border/40 pt-2">
                    <Skeleton className="h-3 w-1/4" />
                </div>
            </div>
        </div>
    );
}

export function ReviewPreviewSkeleton() {
    return (
        <div className="space-y-3 rounded-lg border border-border p-4">
            <div className="space-y-2">
                <Skeleton className="h-4 w-2/3" />
                <Skeleton className="h-3 w-1/2" />
                <div className="flex gap-1">
                    {[...Array(5)].map((_, i) => (
                        <Skeleton key={i} className="size-3.5" />
                    ))}
                </div>
            </div>
            <Skeleton className="h-12 w-full" />
        </div>
    );
}

export function LoadingGrid({ count = 6 }: { count?: number }) {
    return (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {[...Array(count)].map((_, i) => (
                <BookCardSkeleton key={i} />
            ))}
        </div>
    );
}
