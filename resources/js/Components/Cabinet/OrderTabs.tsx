import { Link } from '@inertiajs/react';

type Tab = 'overview' | 'chat' | 'files' | 'stages' | 'participants';

export default function OrderTabs({
    orderId,
    active,
}: {
    orderId: number;
    active: Tab;
}) {
    const tabs: { key: Tab; label: string; href: string }[] = [
        {
            key: 'overview',
            label: 'Обзор',
            href: route('cabinet.orders.show', orderId),
        },
        {
            key: 'chat',
            label: 'Чат',
            href: route('cabinet.orders.chat', orderId),
        },
        {
            key: 'files',
            label: 'Файлы',
            href: route('cabinet.orders.files', orderId),
        },
        {
            key: 'stages',
            label: 'Этапы',
            href: route('cabinet.orders.stages', orderId),
        },
    ];

    return (
        <div className="mb-6 flex flex-wrap gap-2 border-b border-slate-200 pb-3">
            {tabs.map((tab) => (
                <Link
                    key={tab.key}
                    href={tab.href}
                    className={`rounded-md px-3 py-1.5 text-sm ${
                        active === tab.key
                            ? 'bg-slate-900 text-white'
                            : 'bg-white text-slate-600 hover:bg-slate-100'
                    }`}
                >
                    {tab.label}
                </Link>
            ))}
        </div>
    );
}
