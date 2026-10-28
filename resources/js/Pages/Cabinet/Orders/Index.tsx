import CabinetLayout from '@/Layouts/CabinetLayout';
import { Head, Link } from '@inertiajs/react';

/*
 * TODO(cabinet-empty): empty state «пока нет заказов» + следующий шаг для клиента.
 * docs/CABINET_UX.md#empty-states--onboarding--cabinet-empty
 */

type OrderRow = {
    id: number;
    title: string;
    category: string | null;
    status: string;
    status_label: string;
    recruiting_open: boolean;
    unread_count: number;
    tags: { id: number; name: string }[];
    updated_at: string | null;
};

export default function OrdersIndex({
    orders,
}: {
    orders: {
        data: OrderRow[];
        links: { url: string | null; label: string; active: boolean }[];
    };
}) {
    return (
        <CabinetLayout
            header={<h2 className="text-xl font-semibold text-slate-800">Мои заказы</h2>}
        >
            <Head title="Заказы" />
            <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
                <div className="space-y-3">
                    {orders.data.length === 0 && (
                        <p className="text-slate-500">Пока нет доступных заказов.</p>
                    )}
                    {orders.data.map((order) => (
                        <Link
                            key={order.id}
                            href={route('cabinet.orders.show', order.id)}
                            className="block rounded-xl border border-slate-200 bg-white p-4 hover:border-slate-400"
                        >
                            <div className="flex items-start justify-between gap-4">
                                <div>
                                    <h3 className="font-medium text-slate-900">{order.title}</h3>
                                    <p className="mt-1 text-sm text-slate-500">
                                        {order.status_label}
                                        {order.category ? ` · ${order.category}` : ''}
                                    </p>
                                    <div className="mt-2 flex flex-wrap gap-1">
                                        {order.tags.map((tag) => (
                                            <span
                                                key={tag.id}
                                                className="rounded bg-slate-100 px-2 py-0.5 text-xs text-slate-600"
                                            >
                                                {tag.name}
                                            </span>
                                        ))}
                                    </div>
                                </div>
                                {order.unread_count > 0 && (
                                    <span className="rounded-full bg-rose-500 px-2 py-0.5 text-xs text-white">
                                        {order.unread_count}
                                    </span>
                                )}
                            </div>
                        </Link>
                    ))}
                </div>
            </div>
        </CabinetLayout>
    );
}
