import ApplicationLogo from '@/Components/ApplicationLogo';
import Dropdown from '@/Components/Dropdown';
import NavLink from '@/Components/NavLink';
import ResponsiveNavLink from '@/Components/ResponsiveNavLink';
import { Link, usePage } from '@inertiajs/react';
import { PropsWithChildren, ReactNode, useState } from 'react';

/*
 * TODO(cabinet-nav): меню и визуал по ролям — docs/CABINET_UX.md#navigation--roles--cabinet-nav
 * Клиенту не показывать анкету кодера; админу — ссылка в /admin; бренд вместо Breeze slate.
 */

export default function CabinetLayout({
    header,
    children,
}: PropsWithChildren<{ header?: ReactNode }>) {
    const user = usePage().props.auth.user!;
    const roles = user.roles ?? [];
    const isCoder = roles.includes('coder') || user.is_approved_coder;
    const [open, setOpen] = useState(false);

    return (
        <div className="min-h-screen bg-slate-50">
            <nav className="border-b border-slate-200 bg-white">
                <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
                    <div className="flex items-center gap-8">
                        <Link href="/">
                            <ApplicationLogo className="block h-8 w-auto fill-current text-slate-800" />
                        </Link>
                        <div className="hidden items-center gap-6 sm:flex">
                            <NavLink
                                href={route('cabinet.orders.index')}
                                active={route().current('cabinet.orders.*')}
                            >
                                Заказы
                            </NavLink>
                            {isCoder && (
                                <NavLink
                                    href={route('cabinet.feed.index')}
                                    active={route().current('cabinet.feed.*')}
                                >
                                    Лента
                                </NavLink>
                            )}
                            <NavLink
                                href={route('cabinet.coder-application.show')}
                                active={route().current('cabinet.coder-application.*')}
                            >
                                Анкета кодера
                            </NavLink>
                            <NavLink
                                href={route('cabinet.notifications.index')}
                                active={route().current('cabinet.notifications.*')}
                            >
                                Уведомления
                                {(user.unread_notifications ?? 0) > 0 && (
                                    <span className="ms-1 rounded-full bg-rose-500 px-1.5 text-xs text-white">
                                        {user.unread_notifications}
                                    </span>
                                )}
                            </NavLink>
                        </div>
                    </div>

                    <div className="hidden sm:block">
                        <Dropdown>
                            <Dropdown.Trigger>
                                <button
                                    type="button"
                                    className="inline-flex items-center gap-2 rounded-md px-3 py-2 text-sm text-slate-600"
                                >
                                    {user.avatar_url ? (
                                        <img
                                            src={user.avatar_url}
                                            alt=""
                                            className="h-7 w-7 rounded-full object-cover"
                                        />
                                    ) : null}
                                    {user.name}
                                </button>
                            </Dropdown.Trigger>
                            <Dropdown.Content>
                                <Dropdown.Link href={route('profile.edit')}>
                                    Профиль
                                </Dropdown.Link>
                                <Dropdown.Link
                                    href={route('logout')}
                                    method="post"
                                    as="button"
                                >
                                    Выйти
                                </Dropdown.Link>
                            </Dropdown.Content>
                        </Dropdown>
                    </div>

                    <button
                        type="button"
                        className="sm:hidden"
                        onClick={() => setOpen((v) => !v)}
                    >
                        Меню
                    </button>
                </div>

                {open && (
                    <div className="space-y-1 border-t border-slate-200 pb-3 pt-2 sm:hidden">
                        <ResponsiveNavLink
                            href={route('cabinet.orders.index')}
                            active={route().current('cabinet.orders.*')}
                        >
                            Заказы
                        </ResponsiveNavLink>
                        {isCoder && (
                            <ResponsiveNavLink href={route('cabinet.feed.index')}>
                                Лента
                            </ResponsiveNavLink>
                        )}
                        <ResponsiveNavLink href={route('cabinet.coder-application.show')}>
                            Анкета кодера
                        </ResponsiveNavLink>
                        <ResponsiveNavLink href={route('cabinet.notifications.index')}>
                            Уведомления
                        </ResponsiveNavLink>
                        <ResponsiveNavLink href={route('profile.edit')}>
                            Профиль
                        </ResponsiveNavLink>
                    </div>
                )}
            </nav>

            {header && (
                <header className="bg-white shadow-sm">
                    <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
                        {header}
                    </div>
                </header>
            )}

            <main>{children}</main>
        </div>
    );
}
