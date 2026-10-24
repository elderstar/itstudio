import ApplicationLogo from '@/Components/ApplicationLogo';
import { PageProps } from '@/types';
import { Link, usePage } from '@inertiajs/react';
import { PropsWithChildren, useState } from 'react';

export default function MarketingLayout({ children }: PropsWithChildren) {
    const { auth } = usePage<PageProps>().props;
    const [menu_open, setMenuOpen] = useState(false);

    return (
        <div className="min-h-screen bg-canvas text-ink">
            <header className="absolute inset-x-0 top-0 z-50">
                <nav
                    className="flex items-center justify-between px-6 py-5 lg:px-10"
                    aria-label="Основная навигация"
                >
                    <Link href="/" className="flex items-center gap-2.5">
                        <ApplicationLogo className="h-8 w-8 text-coral-500" />
                        <span className="font-display text-sm font-semibold tracking-tight text-ink">
                            CodeNebula
                        </span>
                    </Link>

                    <div className="hidden items-center gap-8 lg:flex">
                        <a href="#about" className="text-sm font-medium text-muted transition hover:text-ink">
                            О студии
                        </a>
                        <a href="#services" className="text-sm font-medium text-muted transition hover:text-ink">
                            Услуги
                        </a>
                        <a href="#process" className="text-sm font-medium text-muted transition hover:text-ink">
                            Этапы
                        </a>
                        {auth.user ? (
                            <Link
                                href={route('dashboard')}
                                className="text-sm font-semibold text-coral-600 transition hover:text-coral-500"
                            >
                                Кабинет
                            </Link>
                        ) : (
                            <Link
                                href={route('login')}
                                className="text-sm font-medium text-muted transition hover:text-ink"
                            >
                                Войти
                            </Link>
                        )}
                        <a
                            href="#contact"
                            className="rounded-2xl bg-coral-500 px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-coral-400"
                        >
                            Отправить заявку
                        </a>
                    </div>

                    <button
                        type="button"
                        onClick={() => setMenuOpen(true)}
                        className="inline-flex rounded-xl p-2 text-ink lg:hidden"
                    >
                        <span className="sr-only">Открыть меню</span>
                        <svg className="size-6" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" />
                        </svg>
                    </button>
                </nav>

                {menu_open && (
                    <div className="lg:hidden" role="dialog" aria-modal="true">
                        <div className="fixed inset-0 z-50 bg-ink/30" onClick={() => setMenuOpen(false)} />
                        <div className="fixed inset-y-0 right-0 z-50 w-full max-w-sm overflow-y-auto bg-surface px-6 py-6 shadow-xl">
                            <div className="flex items-center justify-between">
                                <span className="font-display text-sm font-semibold">CodeNebula</span>
                                <button type="button" onClick={() => setMenuOpen(false)} className="p-2 text-muted">
                                    <span className="sr-only">Закрыть</span>
                                    <svg className="size-6" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M6 18 18 6M6 6l12 12" />
                                    </svg>
                                </button>
                            </div>
                            <div className="mt-8 space-y-1">
                                {[
                                    ['#about', 'О студии'],
                                    ['#services', 'Услуги'],
                                    ['#process', 'Этапы'],
                                    ['#contact', 'Отправить заявку'],
                                ].map(([href, label]) => (
                                    <a
                                        key={href}
                                        href={href}
                                        onClick={() => setMenuOpen(false)}
                                        className="block rounded-xl px-3 py-3 text-base font-semibold text-ink hover:bg-canvas"
                                    >
                                        {label}
                                    </a>
                                ))}
                            </div>
                        </div>
                    </div>
                )}
            </header>

            <main>{children}</main>

            <footer className="border-t border-ink/5 bg-surface">
                <div className="mx-auto flex max-w-7xl flex-col gap-3 px-6 py-8 sm:flex-row sm:items-center sm:justify-between lg:px-10">
                    <div className="flex items-center gap-2">
                        <ApplicationLogo className="h-6 w-6 text-coral-500" />
                        <span className="font-display text-sm font-semibold text-ink">CodeNebula</span>
                    </div>
                    <p className="text-sm text-muted">
                        © {new Date().getFullYear()} CodeNebula. Сайты, приложения и игры.
                    </p>
                    <a href="#contact" className="text-sm font-semibold text-coral-600 hover:text-coral-500">
                        Связаться
                    </a>
                </div>
            </footer>
        </div>
    );
}
