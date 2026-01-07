import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head, useForm } from '@inertiajs/react';
import { ArrowLeft, Save } from 'lucide-react';

interface Book {
    id: string | number;
    title: string;
    subtitle?: string | null;
    author: string;
    description?: string | null;
    isbn?: string;
    cover_url?: string | null;
    published_year?: number;
    publisher?: string | null;
    first_publish_date?: string | null;
    number_of_pages?: number;
}

interface BooksEditProps {
    book: Book;
}

export default function BooksEdit({ book }: BooksEditProps) {
    const { data, setData, patch, processing, errors } = useForm({
        title: book.title ?? '',
        subtitle: book.subtitle ?? '',
        author: book.author ?? '',
        description: book.description ?? '',
        isbn: book.isbn ?? '',
        publisher: book.publisher ?? '',
        published_year: book.published_year ?? '',
        first_publish_date: book.first_publish_date ?? '',
        number_of_pages: book.number_of_pages ?? '',
    });

    const breadcrumbs: BreadcrumbItem[] = [
        {
            title: 'Books',
            href: '/books/search',
        },
        {
            title: book.title,
            href: `/books/${book.id}`,
        },
        {
            title: 'Edit',
            href: `/books/${book.id}/edit`,
        },
    ];

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        patch(`/books/${book.id}`);
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title={`Edit ${book.title}`} />

            <div className="flex flex-1 flex-col gap-6 overflow-x-auto rounded-xl p-4">
                <div className="space-y-2">
                    <h1 className="text-3xl font-bold">Edit Book</h1>
                    <p className="text-sm text-muted-foreground">
                        Update book information that is missing or incorrect
                    </p>
                </div>

                <Card>
                    <CardHeader>
                        <CardTitle>Book Details</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                                <div className="space-y-2">
                                    <Label htmlFor="title">Title</Label>
                                    <Input
                                        id="title"
                                        value={data.title}
                                        onChange={(e) =>
                                            setData('title', e.target.value)
                                        }
                                        placeholder="Book title"
                                        aria-invalid={
                                            errors.title ? 'true' : 'false'
                                        }
                                    />
                                    {errors.title && (
                                        <p className="text-sm text-destructive">
                                            {errors.title}
                                        </p>
                                    )}
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="subtitle">Subtitle</Label>
                                    <Input
                                        id="subtitle"
                                        value={data.subtitle}
                                        onChange={(e) =>
                                            setData('subtitle', e.target.value)
                                        }
                                        placeholder="Book subtitle (optional)"
                                        aria-invalid={
                                            errors.subtitle ? 'true' : 'false'
                                        }
                                    />
                                    {errors.subtitle && (
                                        <p className="text-sm text-destructive">
                                            {errors.subtitle}
                                        </p>
                                    )}
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="author">Author</Label>
                                    <Input
                                        id="author"
                                        value={data.author}
                                        onChange={(e) =>
                                            setData('author', e.target.value)
                                        }
                                        placeholder="Author name"
                                        aria-invalid={
                                            errors.author ? 'true' : 'false'
                                        }
                                    />
                                    {errors.author && (
                                        <p className="text-sm text-destructive">
                                            {errors.author}
                                        </p>
                                    )}
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="isbn">ISBN</Label>
                                    <Input
                                        id="isbn"
                                        value={data.isbn}
                                        onChange={(e) =>
                                            setData('isbn', e.target.value)
                                        }
                                        placeholder="ISBN (optional)"
                                        aria-invalid={
                                            errors.isbn ? 'true' : 'false'
                                        }
                                    />
                                    {errors.isbn && (
                                        <p className="text-sm text-destructive">
                                            {errors.isbn}
                                        </p>
                                    )}
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="publisher">Publisher</Label>
                                    <Input
                                        id="publisher"
                                        value={data.publisher}
                                        onChange={(e) =>
                                            setData('publisher', e.target.value)
                                        }
                                        placeholder="Publisher name (optional)"
                                        aria-invalid={
                                            errors.publisher ? 'true' : 'false'
                                        }
                                    />
                                    {errors.publisher && (
                                        <p className="text-sm text-destructive">
                                            {errors.publisher}
                                        </p>
                                    )}
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="published_year">
                                        Published Year
                                    </Label>
                                    <Input
                                        id="published_year"
                                        type="number"
                                        value={data.published_year}
                                        onChange={(e) =>
                                            setData(
                                                'published_year',
                                                e.target.value,
                                            )
                                        }
                                        placeholder="2024"
                                        aria-invalid={
                                            errors.published_year
                                                ? 'true'
                                                : 'false'
                                        }
                                    />
                                    {errors.published_year && (
                                        <p className="text-sm text-destructive">
                                            {errors.published_year}
                                        </p>
                                    )}
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="first_publish_date">
                                        First Publish Date
                                    </Label>
                                    <Input
                                        id="first_publish_date"
                                        type="date"
                                        value={data.first_publish_date}
                                        onChange={(e) =>
                                            setData(
                                                'first_publish_date',
                                                e.target.value,
                                            )
                                        }
                                        aria-invalid={
                                            errors.first_publish_date
                                                ? 'true'
                                                : 'false'
                                        }
                                    />
                                    {errors.first_publish_date && (
                                        <p className="text-sm text-destructive">
                                            {errors.first_publish_date}
                                        </p>
                                    )}
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="number_of_pages">
                                        Number of Pages
                                    </Label>
                                    <Input
                                        id="number_of_pages"
                                        type="number"
                                        value={data.number_of_pages}
                                        onChange={(e) =>
                                            setData(
                                                'number_of_pages',
                                                e.target.value,
                                            )
                                        }
                                        placeholder="256"
                                        aria-invalid={
                                            errors.number_of_pages
                                                ? 'true'
                                                : 'false'
                                        }
                                    />
                                    {errors.number_of_pages && (
                                        <p className="text-sm text-destructive">
                                            {errors.number_of_pages}
                                        </p>
                                    )}
                                </div>
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="description">Description</Label>
                                <Textarea
                                    id="description"
                                    rows={10}
                                    value={data.description}
                                    onChange={(e) =>
                                        setData('description', e.target.value)
                                    }
                                    placeholder="Add a description for this book..."
                                    aria-invalid={
                                        errors.description ? 'true' : 'false'
                                    }
                                />
                                {errors.description && (
                                    <p className="text-sm text-destructive">
                                        {errors.description}
                                    </p>
                                )}
                                <p className="text-xs text-muted-foreground">
                                    Help other readers by adding a detailed
                                    description of this book.
                                </p>
                            </div>

                            <div className="flex items-center gap-3">
                                <Button
                                    type="submit"
                                    disabled={processing}
                                    className="gap-2"
                                >
                                    <Save className="h-4 w-4" />
                                    {processing ? 'Saving...' : 'Save Changes'}
                                </Button>
                                <Button
                                    type="button"
                                    variant="outline"
                                    onClick={() => window.history.back()}
                                    disabled={processing}
                                    className="gap-2"
                                >
                                    <ArrowLeft className="h-4 w-4" />
                                    Cancel
                                </Button>
                            </div>
                        </form>
                    </CardContent>
                </Card>
            </div>
        </AppLayout>
    );
}
