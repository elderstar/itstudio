import CabinetLayout from '@/Layouts/CabinetLayout';
import { Head, Link, router } from '@inertiajs/react';
import { FormEvent, useState } from 'react';

type OrderCard = {
    id: number;
    title: string;
    category: string | null;
    description: string;
    status_label: string;
    recruiting_open: boolean;
    budget: string | number | null;
    tags: { id: number; name: string; slug: string }[];
    can_join: boolean;
};

export default function FeedIndex({
    orders,
    filters,
    tags,
    categories,
}: {
    orders: { data: OrderCard[] };
    filters: { category: string | null; tag: string | null; recruiting: boolean };
    tags: { id: number; name: string; slug: string }[];
    categories: string[];
}) {
    const [category, setCategory] = useState(filters.category ?? '');
    const [tag, setTag] = useState(filters.tag ?? '');
    const [selected, setSelected] = useState<OrderCard | null>(orders.data[0] ?? null);

    const applyFilters = (e: FormEvent) => {
        e.preventDefault();
        router.get(
            route('cabinet.feed.index'),
            {
                category: category || undefined,
                tag: tag || undefined,
                recruiting: true,
            },
            { preserveState: true },
        );
    };

    return (
        <CabinetLayout header={<h2 className="text-xl font-semibold">Лента заказов</h2>}>
            <Head title="Лента" />
            <div className="mx-auto grid max-w-7xl gap-6 px-4 py-8 lg:grid-cols-[240px_1fr_320px] sm:px-6 lg:px-8">
                <form onSubmit={applyFilters} className="space-y-4 rounded-xl border border-slate-200 bg-white p-4">
                    <div>
                        <label className="text-xs font-medium text-slate-500">Категория</label>
                        <select
                            className="mt-1 w-full rounded-md border border-slate-300 px-2 py-2 text-sm"
                            value={category}
                            onChange={(e) => setCategory(e.target.value)}
                        >
                            <option value="">Все</option>
                            {categories.map((c) => (
                                <option key={c} value={c}>
                                    {c}
                                </option>
                            ))}
                        </select>
                    </div>
                    <div>
                        <label className="text-xs font-medium text-slate-500">Тег</label>
                        <select
                            className="mt-1 w-full rounded-md border border-slate-300 px-2 py-2 text-sm"
                            value={tag}
                            onChange={(e) => setTag(e.target.value)}
                        >
                            <option value="">Все</option>
                            {tags.map((t) => (
                                <option key={t.id} value={t.slug}>
                                    {t.name}
                                </option>
                            ))}
                        </select>
                    </div>
                    <button
                        type="submit"
                        className="w-full rounded-md bg-slate-900 px-3 py-2 text-sm text-white"
                    >
                        Применить
                    </button>
                </form>

                <div className="space-y-3">
                    {orders.data.length === 0 && (
                        <p className="text-slate-500">Нет открытых заказов по фильтрам.</p>
                    )}
                    {orders.data.map((order) => (
                        <button
                            key={order.id}
                            type="button"
                            onClick={() => setSelected(order)}
                            className={`w-full rounded-xl border p-4 text-left ${
                                selected?.id === order.id
                                    ? 'border-slate-900 bg-white'
                                    : 'border-slate-200 bg-white hover:border-slate-400'
                            }`}
                        >
                            <h3 className="font-medium text-slate-900">{order.title}</h3>
                            <p className="mt-1 text-sm text-slate-500">{order.status_label}</p>
                            <p className="mt-2 line-clamp-2 text-sm text-slate-600">
                                {order.description}
                            </p>
                        </button>
                    ))}
                </div>

                <aside className="rounded-xl border border-slate-200 bg-white p-5">
                    {selected ? (
                        <>
                            <h3 className="text-lg font-medium text-slate-900">{selected.title}</h3>
                            <p className="mt-2 text-sm text-slate-600 whitespace-pre-wrap">
                                {selected.description}
                            </p>
                            <div className="mt-3 flex flex-wrap gap-1">
                                {selected.tags.map((t) => (
                                    <span
                                        key={t.id}
                                        className="rounded bg-slate-100 px-2 py-0.5 text-xs"
                                    >
                                        {t.name}
                                    </span>
                                ))}
                            </div>
                            {selected.budget !== null && (
                                <p className="mt-3 text-sm">Бюджет: {selected.budget}</p>
                            )}
                            <div className="mt-4 flex flex-col gap-2">
                                <Link
                                    href={route('cabinet.feed.show', selected.id)}
                                    className="text-sm underline"
                                >
                                    Подробнее
                                </Link>
                                {selected.can_join && (
                                    <button
                                        type="button"
                                        className="rounded-md bg-slate-900 px-3 py-2 text-sm text-white"
                                        onClick={() =>
                                            router.post(route('cabinet.feed.join', selected.id))
                                        }
                                    >
                                        Подать заявку
                                    </button>
                                )}
                            </div>
                        </>
                    ) : (
                        <p className="text-sm text-slate-500">Выберите заказ слева.</p>
                    )}
                </aside>
            </div>
        </CabinetLayout>
    );
}
