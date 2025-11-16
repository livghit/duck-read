import AppLogoIcon from '@/components/app-logo-icon';
import { Button } from '@/components/ui/button';
import {
    Card,
    CardDescription,
    CardHeader,
    CardTitle,
} from '@/components/ui/card';
import { PlaceholderPattern } from '@/components/ui/placeholder-pattern';
import { dashboard, login, register } from '@/routes';
import { type SharedData } from '@/types';
import { Head, Link, usePage } from '@inertiajs/react';
import { BookOpenCheck, Lock, Search, Sparkles } from 'lucide-react';

export default function Welcome({
    canRegister = true,
}: {
    canRegister?: boolean;
}) {
    const { auth, name, quote } = usePage<SharedData>().props;

    const primaryCtaHref = auth.user
        ? dashboard()
        : canRegister
          ? register()
          : login();
    const primaryCtaLabel = auth.user
        ? 'Go to Dashboard'
        : canRegister
          ? 'Get Started'
          : 'Sign In';

    return (
        <>
            <Head title={`${name} – Read. Review. Remember.`} />

            <div className="relative flex min-h-screen flex-col bg-background text-foreground">
                {/* Inner framed container */}
                <div className="relative mx-auto my-4 w-[calc(100%-1rem)] max-w-[1280px] rounded-2xl border bg-background shadow-[0_0_0_1px_rgba(0,0,0,0.06)] dark:shadow-[0_0_0_1px_rgba(255,255,255,0.08)]">
                    {/* Inner edge lines */}
                    <div
                        aria-hidden
                        className="pointer-events-none absolute inset-0 rounded-2xl"
                    >
                        <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-black/10 to-transparent dark:via-white/10" />
                        <div className="absolute inset-x-0 bottom-0 h-px bg-gradient-to-r from-transparent via-black/10 to-transparent dark:via-white/10" />
                        <div className="absolute inset-y-0 left-0 w-px bg-gradient-to-b from-transparent via-black/10 to-transparent dark:via-white/10" />
                        <div className="absolute inset-y-0 right-0 w-px bg-gradient-to-b from-transparent via-black/10 to-transparent dark:via-white/10" />
                    </div>

                    {/* Top navigation */}
                    <header className="relative z-10 w-full">
                        <div className="mx-auto w-full max-w-7xl px-6 py-6 md:px-10">
                            <nav className="flex items-center justify-between">
                                <Link
                                    href={dashboard()}
                                    className="flex items-center gap-2"
                                >
                                    <AppLogoIcon className="size-8 fill-current text-black dark:text-white" />
                                    <span className="hidden text-sm font-semibold md:inline">
                                        {name}
                                    </span>
                                </Link>

                                <div className="flex items-center gap-3">
                                    {auth.user ? (
                                        <Link
                                            prefetch
                                            href={dashboard()}
                                            className="text-sm text-muted-foreground hover:text-foreground"
                                        >
                                            Dashboard
                                        </Link>
                                    ) : (
                                        <>
                                            <Link
                                                prefetch
                                                href={login()}
                                                className="text-sm text-muted-foreground hover:text-foreground"
                                            >
                                                Log in
                                            </Link>
                                            {canRegister && (
                                                <Link
                                                    prefetch
                                                    href={register()}
                                                    className="text-sm text-muted-foreground hover:text-foreground"
                                                >
                                                    Register
                                                </Link>
                                            )}
                                        </>
                                    )}
                                </div>
                            </nav>
                        </div>
                    </header>

                    {/* Hero */}
                    <section className="relative isolate">
                        <div className="mx-auto grid w-full max-w-7xl grid-cols-1 items-center gap-12 px-6 pt-16 pb-8 md:px-10 lg:grid-cols-2 lg:gap-16 lg:pt-24 lg:pb-16">
                            <div>
                                <div className="inline-flex items-center gap-2 rounded-full border px-3 py-1 text-xs text-muted-foreground">
                                    <Sparkles className="size-3.5" />
                                    New: Hybrid local + online search
                                </div>
                                <h1 className="mt-5 text-4xl leading-tight font-semibold tracking-tight text-balance md:text-5xl">
                                    Read deeper. Capture smarter. Remember
                                    longer.
                                </h1>
                                <p className="mt-4 max-w-prose text-base text-pretty text-muted-foreground md:text-lg">
                                    LovedIt is your elegant reading companion
                                    for 2025 — craft beautiful reviews, search
                                    your library instantly, and turn highlights
                                    into insights.
                                </p>
                                <div className="mt-6 flex flex-wrap items-center gap-3">
                                    <Link prefetch href={primaryCtaHref}>
                                        <Button size="lg" className="px-6">
                                            {primaryCtaLabel}
                                        </Button>
                                    </Link>
                                    {!auth.user && (
                                        <Link
                                            prefetch
                                            href={login()}
                                            className="text-sm text-muted-foreground hover:text-foreground"
                                        >
                                            Or sign in
                                        </Link>
                                    )}
                                </div>

                                <div className="mt-10 grid grid-cols-1 gap-4 sm:grid-cols-3">
                                    <Stat label="Books tracked" value="10k+" />
                                    <Stat
                                        label="Reviews written"
                                        value="120k+"
                                    />
                                    <Stat
                                        label="Avg. recall boost"
                                        value="2.4x"
                                    />
                                </div>
                            </div>

                            <div className="relative">
                                <div className="relative overflow-hidden rounded-xl border bg-card shadow-sm">
                                    <PlaceholderPattern className="absolute inset-0 -z-10 h-full w-full stroke-black/5 dark:stroke-white/10" />
                                    <div className="aspect-[16/10] bg-gradient-to-br from-background to-muted/60" />
                                </div>
                                <div className="pointer-events-none absolute -top-6 -left-6 size-24 rounded-xl border bg-background/60 p-3 shadow-sm backdrop-blur">
                                    <AppLogoIcon className="size-full fill-current text-black dark:text-white" />
                                </div>
                            </div>
                        </div>
                    </section>

                    {/* Features */}
                    <section className="mx-auto w-full max-w-7xl px-6 py-12 md:px-10 lg:py-16">
                        <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
                            <Feature
                                icon={BookOpenCheck}
                                title="Beautiful reviews"
                            >
                                Compose thoughtful reviews with a
                                distraction-free editor and rich formatting.
                            </Feature>
                            <Feature icon={Search} title="Hybrid search">
                                Find books locally first, then seamlessly expand
                                to online sources.
                            </Feature>
                            <Feature icon={Lock} title="Private by design">
                                Your library is yours. 2FA, secure sessions, and
                                fine-grained control.
                            </Feature>
                        </div>
                    </section>

                    {/* Quote */}
                    <section className="mx-auto w-full max-w-5xl px-6 pb-16 md:px-10">
                        <Card className="bg-gradient-to-b from-muted/40 to-transparent">
                            <CardHeader>
                                <CardTitle className="text-center text-xl text-balance md:text-2xl">
                                    “{quote.message}”
                                </CardTitle>
                                <CardDescription className="text-center">
                                    — {quote.author}
                                </CardDescription>
                            </CardHeader>
                        </Card>
                    </section>

                    {/* Footer */}
                    <footer className="mt-auto border-t">
                        <div className="mx-auto w-full max-w-7xl px-6 py-8 text-xs text-muted-foreground md:px-10">
                            <div className="flex items-center justify-between">
                                <span>
                                    © {new Date().getFullYear()} {name}
                                </span>
                                <div className="flex items-center gap-4">
                                    <a
                                        href="https://laravel.com"
                                        target="_blank"
                                        rel="noreferrer"
                                        className="hover:text-foreground"
                                    >
                                        Built on Laravel
                                    </a>
                                    <a
                                        href="https://inertiajs.com"
                                        target="_blank"
                                        rel="noreferrer"
                                        className="hover:text-foreground"
                                    >
                                        Inertia v2
                                    </a>
                                </div>
                            </div>
                        </div>
                    </footer>
                </div>
            </div>
        </>
    );
}

function Feature({
    icon: Icon,
    title,
    children,
}: {
    icon: React.ComponentType<{ className?: string }>;
    title: string;
    children: React.ReactNode;
}) {
    return (
        <Card>
            <CardHeader className="flex flex-row items-start gap-3">
                <div className="rounded-md border bg-background p-2">
                    <Icon className="size-5" />
                </div>
                <div className="grid">
                    <CardTitle className="text-base">{title}</CardTitle>
                    <CardDescription className="mt-1 text-sm leading-relaxed">
                        {children}
                    </CardDescription>
                </div>
            </CardHeader>
        </Card>
    );
}

function Stat({ label, value }: { label: string; value: string }) {
    return (
        <div className="rounded-lg border bg-card p-4 text-center">
            <div className="text-2xl font-semibold">{value}</div>
            <div className="text-xs text-muted-foreground">{label}</div>
        </div>
    );
}
