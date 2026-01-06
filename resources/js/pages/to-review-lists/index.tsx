import {
    destroy,
    markReviewed,
} from '@/actions/App/Http/Controllers/ToReviewListController';
import BookCard from '@/components/BookCard';
import { NoToReviewState } from '@/components/EmptyState';
import StarRating from '@/components/StarRating';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
    Card,
    CardContent,
    CardFooter,
    CardHeader,
    CardTitle,
} from '@/components/ui/card';
import {
    Dialog,
    DialogClose,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog';
import {
    Sheet,
    SheetContent,
    SheetHeader,
    SheetTitle,
} from '@/components/ui/sheet';
import { Textarea } from '@/components/ui/textarea';
import { cn } from '@/lib/utils';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head, router } from '@inertiajs/react';
import {
    CalendarClock,
    ExternalLink,
    Loader2,
    Trash2,
} from 'lucide-react';
import React from 'react';

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

const MIN_REVIEW_LENGTH = 10;

type ReviewDraft = {
    rating: number;
    content: string;
};

const defaultDraft: ReviewDraft = {
    rating: 0,
    content: '',
};

const getCoverUrl = (book: Book): string => {
    const placeholder = 'https://placehold.co/600x900?text=No%20Cover';
    const url = book.cover_url ?? '';
    if (!url) return placeholder;
    if (url.includes('placeholder.com')) return placeholder;
    return url;
};

interface ReviewComposerProps {
    item: ToReviewListItem;
    draft: ReviewDraft;
    onDraftChange: (draft: ReviewDraft) => void;
    onSubmit: () => void;
    submitting: boolean;
    onViewBook: () => void;
    onRemove: () => void;
    className?: string;
}

function ReviewComposer({
    item,
    draft,
    onDraftChange,
    onSubmit,
    submitting,
    onViewBook,
    onRemove,
    className,
}: ReviewComposerProps) {
    const remaining = Math.max(
        MIN_REVIEW_LENGTH - draft.content.trim().length,
        0,
    );
    const disableSubmit =
        draft.rating < 1 ||
        draft.content.trim().length < MIN_REVIEW_LENGTH ||
        submitting;

    return (
        <Card className={cn('bg-card/70 shadow-lg', className)}>
            <CardHeader className="gap-3">
                <div className="flex items-start gap-3">
                    <div className="relative h-20 w-14 overflow-hidden rounded-md bg-muted">
                        <img
                            src={getCoverUrl(item.book)}
                            alt={item.book.title}
                            className="h-full w-full object-cover"
                            onError={(e) => {
                                const img = e.currentTarget as HTMLImageElement;
                                if ((img as any).dataset.fallbackApplied) {
                                    return;
                                }
                                (img as any).dataset.fallbackApplied = 'true';
                                img.src = 'https://placehold.co/600x900?text=No%20Cover';
                            }}
                        />
                    </div>
                    <div className="flex-1 space-y-2">
                        <CardTitle className="text-lg leading-tight">
                            {item.book.title}
                        </CardTitle>
                        <p className="text-muted-foreground text-sm">
                            {item.book.author}
                        </p>
                        <Badge variant="outline" className="inline-flex w-fit items-center gap-1">
                            <CalendarClock className="size-4" />
                            Added{' '}
                            {new Date(item.added_at).toLocaleDateString()}
                        </Badge>
                    </div>
                    <Button
                        variant="ghost"
                        size="icon"
                        aria-label="Remove from list"
                        onClick={onRemove}
                    >
                        <Trash2 className="size-4" />
                    </Button>
                </div>
            </CardHeader>
            <CardContent className="space-y-4">
                <div className="space-y-2">
                    <p className="text-sm font-semibold">Rating</p>
                    <StarRating
                        rating={draft.rating}
                        onRatingChange={(value) =>
                            onDraftChange({ ...draft, rating: value })
                        }
                    />
                    <p className="text-muted-foreground text-xs">
                        {draft.rating
                            ? `${draft.rating}/5`
                            : 'Tap a star to start'}
                    </p>
                </div>
                <div className="space-y-2">
                    <p className="text-sm font-semibold">Review</p>
                    <Textarea
                        value={draft.content}
                        onChange={(e) =>
                            onDraftChange({ ...draft, content: e.target.value })
                        }
                        placeholder="Share a brief review (min 10 characters)"
                        className="min-h-[140px]"
                    />
                    <div className="flex items-center justify-between text-xs text-muted-foreground">
                        <span>Minimum {MIN_REVIEW_LENGTH} characters</span>
                        {remaining > 0 && <span>{remaining} to go</span>}
                    </div>
                </div>
            </CardContent>
            <CardFooter className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                <div className="flex w-full gap-2 sm:w-auto">
                    <Button
                        variant="outline"
                        className="flex-1 sm:flex-none"
                        onClick={onViewBook}
                    >
                        <ExternalLink className="size-4" />
                        <span className="ml-2">View book</span>
                    </Button>
                </div>
                <Button
                    className="w-full sm:w-auto"
                    disabled={disableSubmit}
                    onClick={onSubmit}
                >
                    {submitting ? (
                        <>
                            <Loader2 className="size-4 animate-spin" />
                            <span className="ml-2">Publishing...</span>
                        </>
                    ) : (
                        'Publish & archive'
                    )}
                </Button>
            </CardFooter>
        </Card>
    );
}

export default function ToReviewListIndex({ items }: ToReviewListIndexProps) {
    const [selectedId, setSelectedId] = React.useState<string | number | null>(
        items[0]?.id ?? null,
    );
    const [drafts, setDrafts] = React.useState<
        Record<string | number, ReviewDraft>
    >({});
    const [pendingDeleteId, setPendingDeleteId] = React.useState<
        string | number | null
    >(null);
    const [publishingId, setPublishingId] = React.useState<
        string | number | null
    >(null);
    const [removingId, setRemovingId] = React.useState<string | number | null>(
        null,
    );
    const [isMobile, setIsMobile] = React.useState(false);
    const [sheetOpen, setSheetOpen] = React.useState(false);

    const selectedItem =
        items.find((item) => item.id === selectedId) ?? null;

    React.useEffect(() => {
        if (typeof window === 'undefined') {
            return;
        }

        const mediaQuery = window.matchMedia('(max-width: 1023px)');
        const handleChange = (event: MediaQueryListEvent) => {
            setIsMobile(event.matches);
        };

        setIsMobile(mediaQuery.matches);
        mediaQuery.addEventListener('change', handleChange);

        return () => mediaQuery.removeEventListener('change', handleChange);
    }, []);

    React.useEffect(() => {
        if (items.length === 0) {
            setSelectedId(null);
            setSheetOpen(false);
            return;
        }

        const stillExists = items.some((item) => item.id === selectedId);
        if (!stillExists) {
            setSelectedId(items[0].id);
        }
    }, [items, selectedId]);

    const getDraft = (itemId: string | number): ReviewDraft =>
        drafts[itemId] ?? defaultDraft;

    const updateDraft = (
        itemId: string | number,
        nextDraft: ReviewDraft,
    ): void => {
        setDrafts((prev) => ({
            ...prev,
            [itemId]: nextDraft,
        }));
    };

    const handleSelect = (itemId: string | number) => {
        setSelectedId(itemId);
        if (isMobile) {
            setSheetOpen(true);
        }
    };

    const handleViewBook = (book: Book) => {
        router.visit(`/books/${book.id}`);
    };

    const handleMarkReviewed = (itemId: string | number) => {
        const draft = getDraft(itemId);
        setPublishingId(itemId);

        router.post(
            markReviewed.url(Number(itemId)),
            {
                rating: draft.rating,
                content: draft.content,
            },
            {
                preserveScroll: true,
                onSuccess: () => {
                    setSheetOpen(false);
                },
                onFinish: () => setPublishingId(null),
            },
        );
    };

    const handleRemove = (itemId: string | number) => {
        setPendingDeleteId(itemId);
    };

    const confirmRemove = () => {
        if (pendingDeleteId == null) return;
        setRemovingId(pendingDeleteId);

        router.delete(destroy.url(Number(pendingDeleteId)), {
            preserveScroll: true,
            onSuccess: () => {
                if (pendingDeleteId === selectedId) {
                    const nextItem = items.find(
                        (item) => item.id !== pendingDeleteId,
                    );
                    setSelectedId(nextItem?.id ?? null);
                    setSheetOpen(false);
                }
            },
            onFinish: () => {
                setRemovingId(null);
                setPendingDeleteId(null);
            },
        });
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="To-Review List" />

            <div className="flex flex-1 flex-col gap-6 overflow-x-auto rounded-xl p-4">
                <div className="space-y-2">
                    <h1 className="text-3xl font-bold">To-Review List</h1>
                    <p className="text-muted-foreground text-sm">
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
                    <div className="grid gap-6 xl:grid-cols-[2fr_1fr] xl:items-start">
                        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 2xl:grid-cols-3">
                            {items.map((item) => {
                                const isSelected = item.id === selectedId;
                                return (
                                    <div
                                        key={item.id}
                                        className={cn(
                                            'relative flex flex-col gap-3 rounded-xl border bg-card/60 p-3 shadow-sm transition',
                                            isSelected
                                                ? 'ring-2 ring-primary/60'
                                                : '',
                                        )}
                                    >
                                        <BookCard
                                            book={item.book}
                                            onClick={() => handleSelect(item.id)}
                                            disableHover
                                            className="border bg-background/70 shadow-none"
                                        />

                                        <div className="flex items-center justify-between gap-3 rounded-lg border border-dashed bg-background/80 px-3 py-2">
                                            <div className="space-y-1 text-xs text-muted-foreground">
                                                <p className="font-medium text-foreground">
                                                    {item.book.title}
                                                </p>
                                                <p>
                                                    Added{' '}
                                                    {new Date(
                                                        item.added_at,
                                                    ).toLocaleDateString()}
                                                </p>
                                            </div>
                                            <div className="flex items-center gap-2">
                                                <Button
                                                    size="icon"
                                                    variant="outline"
                                                    aria-label="View details"
                                                    onClick={() =>
                                                        handleViewBook(
                                                            item.book,
                                                        )
                                                    }
                                                >
                                                    <ExternalLink className="size-4" />
                                                </Button>
                                                <Button
                                                    size="icon"
                                                    variant="ghost"
                                                    aria-label="Remove from list"
                                                    onClick={() =>
                                                        handleRemove(item.id)
                                                    }
                                                >
                                                    <Trash2 className="size-4" />
                                                </Button>
                                            </div>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>

                        <div className="hidden xl:block">
                            {selectedItem ? (
                                <ReviewComposer
                                    item={selectedItem}
                                    draft={getDraft(selectedItem.id)}
                                    onDraftChange={(draft) =>
                                        updateDraft(selectedItem.id, draft)
                                    }
                                    onSubmit={() =>
                                        handleMarkReviewed(selectedItem.id)
                                    }
                                    submitting={publishingId === selectedItem.id}
                                    onViewBook={() =>
                                        handleViewBook(selectedItem.book)
                                    }
                                    onRemove={() => handleRemove(selectedItem.id)}
                                />
                            ) : (
                                <Card className="bg-card/70">
                                    <CardContent className="space-y-4 pt-6">
                                        <CardTitle className="text-xl">
                                            Select a book to review
                                        </CardTitle>
                                        <p className="text-muted-foreground text-sm">
                                            Choose a book from the list to open the review composer. Your drafts stay on each card until you publish.
                                        </p>
                                    </CardContent>
                                </Card>
                            )}
                        </div>
                    </div>
                ) : (
                    <NoToReviewState
                        onAddClick={() => router.visit('/books/search')}
                    />
                )}
            </div>

            {selectedItem && (
                <Sheet
                    open={sheetOpen && isMobile}
                    onOpenChange={setSheetOpen}
                >
                    <SheetContent
                        side="bottom"
                        className="max-h-[90vh] overflow-y-auto p-0"
                    >
                        <SheetHeader className="border-b px-6 pb-4">
                            <SheetTitle>Quick review</SheetTitle>
                        </SheetHeader>
                        <div className="p-4">
                            <ReviewComposer
                                item={selectedItem}
                                draft={getDraft(selectedItem.id)}
                                onDraftChange={(draft) =>
                                    updateDraft(selectedItem.id, draft)
                                }
                                onSubmit={() =>
                                    handleMarkReviewed(selectedItem.id)
                                }
                                submitting={publishingId === selectedItem.id}
                                onViewBook={() =>
                                    handleViewBook(selectedItem.book)
                                }
                                onRemove={() => handleRemove(selectedItem.id)}
                                className="shadow-none"
                            />
                        </div>
                    </SheetContent>
                </Sheet>
            )}

            <Dialog
                open={pendingDeleteId !== null}
                onOpenChange={(open) => {
                    if (!open) {
                        setPendingDeleteId(null);
                    }
                }}
            >
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Remove from list?</DialogTitle>
                        <DialogDescription>
                            This will remove{' '}
                            <span className="font-medium">
                                {
                                    items.find(
                                        (item) =>
                                            item.id === pendingDeleteId,
                                    )?.book.title ?? 'this book'
                                }
                            </span>{' '}
                            from your to-review list.
                        </DialogDescription>
                    </DialogHeader>
                    <DialogFooter>
                        <DialogClose asChild>
                            <Button variant="outline" type="button">
                                Cancel
                            </Button>
                        </DialogClose>
                        <Button
                            variant="destructive"
                            type="button"
                            onClick={confirmRemove}
                            disabled={removingId !== null}
                        >
                            {removingId ? 'Removing...' : 'Delete'}
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </AppLayout>
    );
}
