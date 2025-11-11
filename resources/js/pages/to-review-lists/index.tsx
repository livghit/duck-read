import {
    destroy,
    markReviewed,
} from '@/actions/App/Http/Controllers/ToReviewListController';
import BookCard from '@/components/BookCard';
import { NoToReviewState } from '@/components/EmptyState';
import StarRating from '@/components/StarRating';
import { Button } from '@/components/ui/button';
import {
    Dialog,
    DialogClose,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from '@/components/ui/dialog';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Textarea } from '@/components/ui/textarea';
import {
    Tooltip,
    TooltipContent,
    TooltipTrigger,
} from '@/components/ui/tooltip';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head, router } from '@inertiajs/react';
import { MoreHorizontal, Trash2 } from 'lucide-react';

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

import React from 'react';
export default function ToReviewListIndex({ items }: ToReviewListIndexProps) {
    const [pendingDeleteId, setPendingDeleteId] = React.useState<
        string | number | null
    >(null);

    const handleRemove = (itemId: string | number) => {
        setPendingDeleteId(itemId);
    };

    const confirmRemove = () => {
        if (pendingDeleteId == null) return;
        router.delete(destroy.url(Number(pendingDeleteId)), {
            onSuccess: () => setPendingDeleteId(null),
            onFinish: () => setPendingDeleteId(null),
        });
    };

    const [openId, setOpenId] = React.useState<string | number | null>(null);
    const [rating, setRating] = React.useState<number>(0);
    const [content, setContent] = React.useState<string>('');

    const resetForm = () => {
        setRating(0);
        setContent('');
    };

    const handleMarkReviewed = (itemId: string | number) => {
        router.post(
            markReviewed.url(Number(itemId)),
            {
                rating,
                content,
            },
            {
                onSuccess: () => {
                    setOpenId(null);
                    resetForm();
                },
                onError: () => {
                    // Keep dialog open; errors will be shown via page props after Inertia re-render
                },
            },
        );
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
                    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                        {items.map((item) => (
                            <div key={item.id} className="group relative">
                                <BookCard
                                    book={item.book}
                                    onClick={() => handleViewBook(item.book)}
                                />

                                {/* Actions */}
                                <div className="pointer-events-none absolute inset-x-0 bottom-0 flex flex-col items-stretch">
                                    {/* Desktop Hover Bar */}
                                    <div className="pointer-events-none hidden translate-y-2 gap-2 p-2 opacity-0 transition-all duration-200 group-focus-within:translate-y-0 group-focus-within:opacity-100 group-hover:translate-y-0 group-hover:opacity-100 motion-reduce:transition-none sm:flex">
                                        <Dialog
                                            open={openId === item.id}
                                            onOpenChange={(open) => {
                                                if (open) {
                                                    setOpenId(item.id);
                                                } else {
                                                    setOpenId(null);
                                                    resetForm();
                                                }
                                            }}
                                        >
                                            <DialogTrigger asChild>
                                                <Button
                                                    size="sm"
                                                    variant="secondary"
                                                    className="pointer-events-auto flex-1"
                                                    onClick={() =>
                                                        setOpenId(item.id)
                                                    }
                                                >
                                                    Review
                                                </Button>
                                            </DialogTrigger>
                                            <DialogContent>
                                                <DialogHeader>
                                                    <DialogTitle>
                                                        Quick Review
                                                    </DialogTitle>
                                                    <DialogDescription>
                                                        {item.book.title} by{' '}
                                                        {item.book.author}
                                                    </DialogDescription>
                                                </DialogHeader>
                                                <div className="space-y-4">
                                                    <div className="space-y-2">
                                                        <label className="text-sm font-medium">
                                                            Rating
                                                        </label>
                                                        <StarRating
                                                            rating={rating}
                                                            onRatingChange={
                                                                setRating
                                                            }
                                                        />
                                                        <p className="text-muted-foreground text-xs">
                                                            {rating > 0
                                                                ? `${rating}/5 stars`
                                                                : 'Select a rating'}
                                                        </p>
                                                    </div>
                                                    <div className="space-y-2">
                                                        <label
                                                            htmlFor="content"
                                                            className="text-sm font-medium"
                                                        >
                                                            Review
                                                        </label>
                                                        <Textarea
                                                            id="content"
                                                            value={content}
                                                            onChange={(e) =>
                                                                setContent(
                                                                    e.target
                                                                        .value,
                                                                )
                                                            }
                                                            placeholder="Share a brief review (min 10 characters)"
                                                            className="min-h-[140px]"
                                                        />
                                                        <p className="text-muted-foreground text-xs">
                                                            Minimum 10
                                                            characters.
                                                        </p>
                                                    </div>
                                                </div>
                                                <DialogFooter>
                                                    <DialogClose asChild>
                                                        <Button
                                                            variant="outline"
                                                            type="button"
                                                        >
                                                            Cancel
                                                        </Button>
                                                    </DialogClose>
                                                    <Button
                                                        type="button"
                                                        disabled={
                                                            rating < 1 ||
                                                            content.trim()
                                                                .length < 10
                                                        }
                                                        onClick={() =>
                                                            handleMarkReviewed(
                                                                item.id,
                                                            )
                                                        }
                                                    >
                                                        Publish Review
                                                    </Button>
                                                </DialogFooter>
                                            </DialogContent>
                                        </Dialog>
                                        <Dialog
                                            open={pendingDeleteId === item.id}
                                            onOpenChange={(open) =>
                                                !open &&
                                                setPendingDeleteId(null)
                                            }
                                        >
                                            <DialogTrigger asChild>
                                                <Tooltip>
                                                    <TooltipTrigger asChild>
                                                        <Button
                                                            size="sm"
                                                            variant="destructive"
                                                            className="pointer-events-auto"
                                                            onClick={() =>
                                                                handleRemove(
                                                                    item.id,
                                                                )
                                                            }
                                                            aria-label="Delete from list"
                                                        >
                                                            <Trash2 className="size-4" />
                                                        </Button>
                                                    </TooltipTrigger>
                                                    <TooltipContent>
                                                        Remove from list
                                                    </TooltipContent>
                                                </Tooltip>
                                            </DialogTrigger>
                                            <DialogContent>
                                                <DialogHeader>
                                                    <DialogTitle>
                                                        Remove from list?
                                                    </DialogTitle>
                                                    <DialogDescription>
                                                        This will remove{' '}
                                                        <span className="font-medium">
                                                            {item.book.title}
                                                        </span>{' '}
                                                        from your to-review
                                                        list.
                                                    </DialogDescription>
                                                </DialogHeader>
                                                <DialogFooter>
                                                    <DialogClose asChild>
                                                        <Button
                                                            variant="outline"
                                                            type="button"
                                                        >
                                                            Cancel
                                                        </Button>
                                                    </DialogClose>
                                                    <Button
                                                        variant="destructive"
                                                        type="button"
                                                        onClick={confirmRemove}
                                                    >
                                                        Delete
                                                    </Button>
                                                </DialogFooter>
                                            </DialogContent>
                                        </Dialog>
                                    </div>

                                    {/* Mobile Persistent Actions */}
                                    <div className="pointer-events-auto flex items-center gap-2 p-2 sm:hidden">
                                        <Dialog
                                            open={openId === item.id}
                                            onOpenChange={(open) => {
                                                if (open) {
                                                    setOpenId(item.id);
                                                } else {
                                                    setOpenId(null);
                                                    resetForm();
                                                }
                                            }}
                                        >
                                            <DialogTrigger asChild>
                                                <Button
                                                    size="sm"
                                                    variant="secondary"
                                                    className="flex-1"
                                                    onClick={() =>
                                                        setOpenId(item.id)
                                                    }
                                                >
                                                    Review
                                                </Button>
                                            </DialogTrigger>
                                            <DialogContent>
                                                <DialogHeader>
                                                    <DialogTitle>
                                                        Quick Review
                                                    </DialogTitle>
                                                    <DialogDescription>
                                                        {item.book.title} by{' '}
                                                        {item.book.author}
                                                    </DialogDescription>
                                                </DialogHeader>
                                                <div className="space-y-4">
                                                    <div className="space-y-2">
                                                        <label className="text-sm font-medium">
                                                            Rating
                                                        </label>
                                                        <StarRating
                                                            rating={rating}
                                                            onRatingChange={
                                                                setRating
                                                            }
                                                        />
                                                        <p className="text-muted-foreground text-xs">
                                                            {rating > 0
                                                                ? `${rating}/5 stars`
                                                                : 'Select a rating'}
                                                        </p>
                                                    </div>
                                                    <div className="space-y-2">
                                                        <label
                                                            htmlFor="content"
                                                            className="text-sm font-medium"
                                                        >
                                                            Review
                                                        </label>
                                                        <Textarea
                                                            id="content"
                                                            value={content}
                                                            onChange={(e) =>
                                                                setContent(
                                                                    e.target
                                                                        .value,
                                                                )
                                                            }
                                                            placeholder="Share a brief review (min 10 characters)"
                                                            className="min-h-[140px]"
                                                        />
                                                        <p className="text-muted-foreground text-xs">
                                                            Minimum 10
                                                            characters.
                                                        </p>
                                                    </div>
                                                </div>
                                                <DialogFooter>
                                                    <DialogClose asChild>
                                                        <Button
                                                            variant="outline"
                                                            type="button"
                                                        >
                                                            Cancel
                                                        </Button>
                                                    </DialogClose>
                                                    <Button
                                                        type="button"
                                                        disabled={
                                                            rating < 1 ||
                                                            content.trim()
                                                                .length < 10
                                                        }
                                                        onClick={() =>
                                                            handleMarkReviewed(
                                                                item.id,
                                                            )
                                                        }
                                                    >
                                                        Publish Review
                                                    </Button>
                                                </DialogFooter>
                                            </DialogContent>
                                        </Dialog>

                                        <DropdownMenu>
                                            <DropdownMenuTrigger asChild>
                                                <Button
                                                    size="icon"
                                                    variant="outline"
                                                    aria-label="More actions"
                                                >
                                                    <MoreHorizontal className="size-5" />
                                                </Button>
                                            </DropdownMenuTrigger>
                                            <DropdownMenuContent align="end">
                                                <Dialog
                                                    open={
                                                        pendingDeleteId ===
                                                        item.id
                                                    }
                                                    onOpenChange={(open) =>
                                                        !open &&
                                                        setPendingDeleteId(null)
                                                    }
                                                >
                                                    <DialogTrigger asChild>
                                                        <div>
                                                            <DropdownMenuItem
                                                                onSelect={(
                                                                    e,
                                                                ) => {
                                                                    e.preventDefault();
                                                                    handleRemove(
                                                                        item.id,
                                                                    );
                                                                }}
                                                                variant="destructive"
                                                            >
                                                                <Trash2 className="size-4" />{' '}
                                                                Delete
                                                            </DropdownMenuItem>
                                                        </div>
                                                    </DialogTrigger>
                                                    <DialogContent>
                                                        <DialogHeader>
                                                            <DialogTitle>
                                                                Remove from
                                                                list?
                                                            </DialogTitle>
                                                            <DialogDescription>
                                                                This will remove{' '}
                                                                <span className="font-medium">
                                                                    {
                                                                        item
                                                                            .book
                                                                            .title
                                                                    }
                                                                </span>{' '}
                                                                from your
                                                                to-review list.
                                                            </DialogDescription>
                                                        </DialogHeader>
                                                        <DialogFooter>
                                                            <DialogClose
                                                                asChild
                                                            >
                                                                <Button
                                                                    variant="outline"
                                                                    type="button"
                                                                >
                                                                    Cancel
                                                                </Button>
                                                            </DialogClose>
                                                            <Button
                                                                variant="destructive"
                                                                type="button"
                                                                onClick={
                                                                    confirmRemove
                                                                }
                                                            >
                                                                Delete
                                                            </Button>
                                                        </DialogFooter>
                                                    </DialogContent>
                                                </Dialog>
                                            </DropdownMenuContent>
                                        </DropdownMenu>
                                    </div>
                                </div>

                                {/* Date Added */}
                                <p className="text-muted-foreground mt-2 text-center text-xs">
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
