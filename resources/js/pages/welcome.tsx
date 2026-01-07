import AppLogoIcon from '@/components/app-logo-icon';
import { Button } from '@/components/ui/button';
import {} from '@/components/ui/card';
import { dashboard, login, register } from '@/routes';
import { type SharedData } from '@/types';
import { Head, Link, usePage } from '@inertiajs/react';
import {
    ArrowRight,
    BookOpenCheck,
    CheckCircle2,
    Github,
    Globe2,
    Lock,
    Search,
    Sparkles,
    Twitter,
    Zap,
} from 'lucide-react';

export default function Welcome({
    canRegister = true,
}: {
    canRegister?: boolean;
}) {
    const { auth, name, quote } = usePage<SharedData>().props;

    return (
        <>
            <Head title={`${name} – Your Personal Reading Journal`} />

            <div className="min-h-screen bg-background font-sans text-foreground antialiased selection:bg-primary selection:text-primary-foreground">
                {/* Navbar */}
                <header className="fixed top-0 right-0 left-0 z-50 border-b border-white/10 bg-background/80 backdrop-blur-md">
                    <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-6 lg:px-8">
                        <Link
                            href={dashboard()}
                            className="flex items-center gap-2"
                        >
                            <div className="flex size-8 items-center justify-center rounded-lg bg-primary text-primary-foreground">
                                <AppLogoIcon className="size-5 fill-current" />
                            </div>
                            <span className="text-lg font-bold tracking-tight">
                                {name}
                            </span>
                        </Link>

                        <nav className="hidden items-center gap-8 md:flex">
                            {/* Placeholder for future sections */}
                        </nav>

                        <div className="flex items-center gap-4">
                            {auth.user ? (
                                <Link href={dashboard()}>
                                    <Button variant="default" size="sm">
                                        Dashboard
                                    </Button>
                                </Link>
                            ) : (
                                <>
                                    <Link
                                        href={login()}
                                        className="text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
                                    >
                                        Log in
                                    </Link>
                                    {canRegister && (
                                        <Link href={register()}>
                                            <Button size="sm">
                                                Get Started
                                            </Button>
                                        </Link>
                                    )}
                                </>
                            )}
                        </div>
                    </div>
                </header>

                <main>
                    {/* Hero Section */}
                    <section className="relative isolate overflow-hidden pt-32 pb-20 lg:pt-40 lg:pb-32">
                        {/* Background Effects */}
                        <div className="absolute inset-0 -z-10 h-full w-full bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)] bg-[size:24px_24px]"></div>
                        <div className="absolute top-0 left-1/2 -z-10 h-[500px] w-[500px] -translate-x-1/2 rounded-full bg-primary/20 opacity-50 blur-[100px]"></div>

                        <div className="mx-auto max-w-7xl px-6 text-center lg:px-8">
                            <div className="mx-auto mb-8 flex max-w-fit items-center justify-center space-x-2 overflow-hidden rounded-full border border-primary/20 bg-primary/10 px-4 py-1.5 backdrop-blur transition-all hover:border-primary/40 hover:bg-primary/20">
                                <Sparkles className="size-4 text-primary" />
                                <p className="text-sm font-semibold text-primary">
                                    Your Personal Reading Journal
                                </p>
                            </div>

                            <h1 className="mx-auto max-w-4xl text-5xl font-bold tracking-tight text-foreground sm:text-7xl">
                                Keep all your{' '}
                                <span className="text-primary">
                                    book reviews
                                </span>{' '}
                                in one place.
                            </h1>

                            <p className="mx-auto mt-6 max-w-2xl text-lg leading-8 text-muted-foreground">
                                Track every book you've read, write meaningful
                                reviews, and share your reading journey with
                                others. Build a personal library that grows with
                                you.
                            </p>

                            <div className="mt-10 flex items-center justify-center gap-x-6">
                                <Link
                                    href={auth.user ? dashboard() : register()}
                                >
                                    <Button
                                        size="lg"
                                        className="h-12 px-8 text-base shadow-lg shadow-primary/25"
                                    >
                                        {auth.user
                                            ? 'Go to Library'
                                            : 'Start for Free'}
                                        <ArrowRight className="ml-2 size-4" />
                                    </Button>
                                </Link>
                                {!auth.user && (
                                    <Link
                                        href={login()}
                                        className="text-sm leading-6 font-semibold text-foreground transition-colors hover:text-primary"
                                    >
                                        Already have an account?{' '}
                                        <span aria-hidden="true">→</span>
                                    </Link>
                                )}
                            </div>

                            {/* Hero Image / Dashboard Preview */}
                            <div className="mt-16 flow-root sm:mt-24">
                                <div className="-m-2 rounded-xl bg-gray-900/5 p-2 ring-1 ring-gray-900/10 ring-inset lg:-m-4 lg:rounded-2xl lg:p-4 dark:bg-white/5 dark:ring-white/10">
                                    <div className="relative aspect-[16/9] overflow-hidden rounded-lg border border-border/50 bg-card shadow-2xl">
                                        <div className="absolute inset-0 z-0 bg-gradient-to-tr from-primary/5 via-background to-background"></div>
                                        <div className="relative z-10 flex h-full items-center justify-center text-muted-foreground">
                                            <div className="text-center">
                                                <AppLogoIcon className="mx-auto size-20 opacity-20" />
                                                <p className="mt-4 font-medium">
                                                    Your Personal Library
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </section>

                    {/* Stats Section */}
                    <section className="border-y border-white/5 bg-white/5 py-12">
                        <div className="mx-auto max-w-7xl px-6 lg:px-8">
                            <dl className="grid grid-cols-1 gap-x-8 gap-y-16 text-center lg:grid-cols-3">
                                <div className="mx-auto flex max-w-xs flex-col gap-y-4">
                                    <dt className="text-base leading-7 text-muted-foreground">
                                        Books in Library
                                    </dt>
                                    <dd className="order-first text-3xl font-semibold tracking-tight text-foreground sm:text-5xl">
                                        ∞
                                    </dd>
                                </div>
                                <div className="mx-auto flex max-w-xs flex-col gap-y-4">
                                    <dt className="text-base leading-7 text-muted-foreground">
                                        Reviews & Notes
                                    </dt>
                                    <dd className="order-first text-3xl font-semibold tracking-tight text-foreground sm:text-5xl">
                                        Never Lost
                                    </dd>
                                </div>
                                <div className="mx-auto flex max-w-xs flex-col gap-y-4">
                                    <dt className="text-base leading-7 text-muted-foreground">
                                        Reading Lists
                                    </dt>
                                    <dd className="order-first text-3xl font-semibold tracking-tight text-foreground sm:text-5xl">
                                        All in One Place
                                    </dd>
                                </div>
                            </dl>
                        </div>
                    </section>

                    {/* Features Grid */}
                    <section id="features" className="py-24 sm:py-32">
                        <div className="mx-auto max-w-7xl px-6 lg:px-8">
                            <div className="mx-auto max-w-2xl text-center">
                                <h2 className="text-base leading-7 font-semibold text-primary">
                                    Everything you need
                                </h2>
                                <p className="mt-2 text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
                                    Share your reading journey
                                </p>
                                <p className="mt-6 text-lg leading-8 text-muted-foreground">
                                    A simple, beautiful way to track, review,
                                    and share books that matter to you.
                                </p>
                            </div>

                            <div className="mx-auto mt-16 max-w-2xl sm:mt-20 lg:mt-24 lg:max-w-none">
                                <div className="grid max-w-xl grid-cols-1 gap-x-8 gap-y-16 lg:max-w-none lg:grid-cols-3">
                                    <FeatureCard
                                        icon={BookOpenCheck}
                                        title="Write Reviews"
                                        description="Share your thoughts on every book you've read with beautiful, distraction-free review editor. Your reviews, your way."
                                    />
                                    <FeatureCard
                                        icon={Search}
                                        title="Discover Books"
                                        description="Search millions of books online and save them to your personal library. Find your next great read effortlessly."
                                    />
                                    <FeatureCard
                                        icon={CheckCircle2}
                                        title="Track Reading List"
                                        description="Keep track of books you want to read with a simple to-review list. Never forget a recommendation again."
                                    />
                                    <FeatureCard
                                        icon={Globe2}
                                        title="Share with Others"
                                        description="Share your reviews and reading progress with friends and community. Connect through your reading journey."
                                    />
                                    <FeatureCard
                                        icon={Zap}
                                        title="Quick Access"
                                        description="All your books, reviews, and lists in one place. Fast, organized, and always accessible."
                                    />
                                    <FeatureCard
                                        icon={Lock}
                                        title="Your Data, Your Way"
                                        description="Your reviews and library are yours. Edit book information, add descriptions, and personalize your collection."
                                    />
                                </div>
                            </div>
                        </div>
                    </section>

                    {/* Quote Section */}
                    <section className="relative isolate overflow-hidden bg-primary/5 px-6 py-24 sm:py-32 lg:px-8">
                        <div className="absolute inset-0 -z-10 bg-[radial-gradient(45rem_50rem_at_top,theme(colors.primary.DEFAULT),transparent)] opacity-10" />
                        <div className="absolute inset-y-0 right-1/2 -z-10 mr-16 w-[200%] origin-bottom-left skew-x-[-30deg] bg-background shadow-xl ring-1 shadow-primary/10 ring-primary/10 sm:mr-28 lg:mr-0 xl:mr-16 xl:origin-center" />

                        <div className="mx-auto max-w-2xl lg:max-w-4xl">
                            <figure className="mt-10">
                                <blockquote className="text-center text-xl leading-8 font-semibold text-foreground sm:text-2xl sm:leading-9">
                                    <p>“{quote.message}”</p>
                                </blockquote>
                                <figcaption className="mt-10">
                                    <div className="mt-4 flex items-center justify-center space-x-3 text-base">
                                        <div className="font-semibold text-foreground">
                                            {quote.author}
                                        </div>
                                    </div>
                                </figcaption>
                            </figure>
                        </div>
                    </section>
                </main>

                {/* Footer */}
                <footer className="border-t border-white/10 bg-background">
                    <div className="mx-auto max-w-7xl px-6 py-12 md:flex md:items-center md:justify-between lg:px-8">
                        <div className="flex justify-center space-x-6 md:order-2">
                            <a
                                href="#"
                                className="text-muted-foreground hover:text-foreground"
                            >
                                <span className="sr-only">Twitter</span>
                                <Twitter className="h-6 w-6" />
                            </a>
                            <a
                                href="#"
                                className="text-muted-foreground hover:text-foreground"
                            >
                                <span className="sr-only">GitHub</span>
                                <Github className="h-6 w-6" />
                            </a>
                        </div>
                        <div className="mt-8 md:order-1 md:mt-0">
                            <p className="text-center text-xs leading-5 text-muted-foreground">
                                &copy; {new Date().getFullYear()} {name}. All
                                rights reserved. Built on Laravel & Inertia.
                            </p>
                        </div>
                    </div>
                </footer>
            </div>
        </>
    );
}

function FeatureCard({
    icon: Icon,
    title,
    description,
}: {
    icon: any;
    title: string;
    description: string;
}) {
    return (
        <div className="flex flex-col rounded-2xl border border-white/5 bg-card/50 p-6 transition-colors hover:border-primary/50">
            <dt className="flex items-center gap-x-3 text-base leading-7 font-semibold text-foreground">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
                    <Icon className="h-6 w-6 text-primary" aria-hidden="true" />
                </div>
                {title}
            </dt>
            <dd className="mt-4 flex flex-auto flex-col text-base leading-7 text-muted-foreground">
                <p className="flex-auto">{description}</p>
            </dd>
        </div>
    );
}
