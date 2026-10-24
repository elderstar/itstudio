import OrderTabs from '@/Components/Cabinet/OrderTabs';
import CabinetLayout from '@/Layouts/CabinetLayout';
import { Head, router } from '@inertiajs/react';

type Order = {
    id: number;
    title: string;
    category: string | null;
    description: string | null;
    brief: string | null;
    status_label: string;
    recruiting_open: boolean;
    budget: string | number | null;
    stages_approved_at: string | null;
    tags: { id: number; name: string }[];
    client: { id: number; name: string; email: string };
    participants: {
        id: number;
        role: string;
        user: { id: number; name: string; email: string; avatar_url?: string | null };
    }[];
};

export default function OrderShow({
    order,
    can_approve_stages,
}: {
    order: Order;
    can_approve_stages: boolean;
}) {
    return (
        <CabinetLayout
            header={<h2 className="text-xl font-semibold text-slate-800">{order.title}</h2>}
        >
            <Head title={order.title} />
            <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
                <OrderTabs orderId={order.id} active="overview" />

                <div className="grid gap-6 lg:grid-cols-3">
                    <div className="space-y-4 lg:col-span-2">
                        <section className="rounded-xl border border-slate-200 bg-white p-5">
                            <h3 className="font-medium text-slate-900">Описание</h3>
                            <p className="mt-2 whitespace-pre-wrap text-sm text-slate-600">
                                {order.description || '—'}
                            </p>
                        </section>
                        <section className="rounded-xl border border-slate-200 bg-white p-5">
                            <h3 className="font-medium text-slate-900">Brief / ТЗ</h3>
                            <p className="mt-2 whitespace-pre-wrap text-sm text-slate-600">
                                {order.brief || '—'}
                            </p>
                        </section>
                    </div>

                    <aside className="space-y-4">
                        <section className="rounded-xl border border-slate-200 bg-white p-5 text-sm">
                            <p>
                                <span className="text-slate-500">Статус:</span> {order.status_label}
                            </p>
                            <p className="mt-2">
                                <span className="text-slate-500">Набор:</span>{' '}
                                {order.recruiting_open ? 'открыт' : 'закрыт'}
                            </p>
                            {order.budget !== null && (
                                <p className="mt-2">
                                    <span className="text-slate-500">Бюджет:</span> {order.budget}
                                </p>
                            )}
                            <p className="mt-2">
                                <span className="text-slate-500">Клиент:</span> {order.client.name}
                            </p>
                            <div className="mt-3 flex flex-wrap gap-1">
                                {order.tags.map((tag) => (
                                    <span
                                        key={tag.id}
                                        className="rounded bg-slate-100 px-2 py-0.5 text-xs"
                                    >
                                        {tag.name}
                                    </span>
                                ))}
                            </div>
                            {can_approve_stages && !order.stages_approved_at && (
                                <button
                                    type="button"
                                    className="mt-4 w-full rounded-md bg-slate-900 px-3 py-2 text-white"
                                    onClick={() =>
                                        router.post(route('cabinet.orders.approve-stages', order.id))
                                    }
                                >
                                    Согласовать этапы
                                </button>
                            )}
                        </section>

                        <section className="rounded-xl border border-slate-200 bg-white p-5">
                            <h3 className="font-medium text-slate-900">Участники</h3>
                            <ul className="mt-3 space-y-2">
                                {order.participants.map((p) => (
                                    <li key={p.id} className="flex items-center gap-2 text-sm">
                                        {p.user.avatar_url ? (
                                            <img
                                                src={p.user.avatar_url}
                                                alt=""
                                                className="h-7 w-7 rounded-full object-cover"
                                            />
                                        ) : (
                                            <span className="flex h-7 w-7 items-center justify-center rounded-full bg-slate-200 text-xs">
                                                {p.user.name.slice(0, 1)}
                                            </span>
                                        )}
                                        <span>
                                            {p.user.name}{' '}
                                            <span className="text-slate-400">({p.role})</span>
                                        </span>
                                    </li>
                                ))}
                            </ul>
                        </section>
                    </aside>
                </div>
            </div>
        </CabinetLayout>
    );
}
