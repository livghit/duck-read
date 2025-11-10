import { Card, CardContent } from '@/components/ui/card';
import { cn } from '@/lib/utils';

interface BookCardProps {
    book: {
        id?: string | number;
        title: string;
        author: string;
        cover_url?: string | null;
        isbn?: string;
        rating?: number;
    };
    onClick?: () => void;
    className?: string;
}

export default function BookCard({ book, onClick, className }: BookCardProps) {
    return (
        <Card
            onClick={onClick}
            className={cn(
                'overflow-hidden transition-all hover:shadow-lg dark:hover:shadow-lg/20',
                onClick && 'cursor-pointer',
                className,
            )}
        >
            <CardContent className="p-0">
                <div className="flex h-full flex-col">
                    {book.cover_url ? (
                        <div className="relative aspect-[2/3] w-full overflow-hidden bg-muted">
                            <img
                                src={book.cover_url}
                                alt={book.title}
                                className="h-full w-full object-cover"
                            />
                        </div>
                    ) : (
                        <div className="flex aspect-[2/3] w-full items-center justify-center bg-gradient-to-br from-muted to-muted-foreground/20">
                            <div className="px-4 py-8 text-center">
                                <div className="text-sm font-medium text-muted-foreground">
                                    No Cover
                                </div>
                            </div>
                        </div>
                    )}

                    <div className="flex flex-1 flex-col gap-2 p-3">
                        <div>
                            <h3 className="line-clamp-2 text-sm leading-tight font-semibold">
                                {book.title}
                            </h3>
                            <p className="mt-1 line-clamp-1 text-xs text-muted-foreground">
                                {book.author}
                            </p>
                        </div>

                        {book.rating !== undefined && (
                            <div className="mt-auto flex items-center gap-1 border-t border-border/40 pt-2">
                                <span className="text-xs font-medium">
                                    {book.rating}
                                </span>
                                <span className="text-xs text-muted-foreground">
                                    /5
                                </span>
                            </div>
                        )}
                    </div>
                </div>
            </CardContent>
        </Card>
    );
}
