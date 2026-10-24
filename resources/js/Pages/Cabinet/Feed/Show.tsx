import CabinetLayout from '@/Layouts/CabinetLayout';
import { Head, router } from '@inertiajs/react';

export default function FeedShow({
    order,
}: {
    order: {
        id: number;
        title: string;
        category: string | null;
        description: string | null;
        status_label: string;
        recruiting_open: boolean;
        budget: string | number | null;
        tags: { id: number; name: string }[];
        can_join: boolean;
    };
}) {
    return (
        <CabinetLayout header={<h2 className="text-xl font-semibold">{order.title}</h2>}>
            <Head title={order.title} />
            <div className="mx-auto max-w-3xl px-4 py-8 sm:px-6 lg:px-8">
                <div className="rounded-xl border border-slate-200 bg-white p-6">
                    <p className="text-sm text-slate-500">{order.status_label}</p>
                    <p className="mt-4 whitespace-pre-wrap text-slate-700">
                        {order.description}
                    </p>
                    <div className="mt-4 flex flex-wrap gap-1">
                        {order.tags.map((tag) => (
                            <span key={tag.id} className="rounded bg-slate-100 px-2 py-0.5 text-xs">
                                {tag.name}
                            </span>
                        ))}
                    </div>
                    {order.budget !== null && (
                        <p className="mt-4 text-sm">Бюджет: {order.budget}</p>
                    )}
                    {order.can_join && (
                        <button
                            type="button"
                            className="mt-6 rounded-md bg-slate-900 px-4 py-2 text-sm text-white"
                            onClick={() => router.post(route('cabinet.feed.join', order.id))}
                        >
                            Подать заявку
                        </button>
                    )}
                </div>
            </div>
        </CabinetLayout>
    );
}
