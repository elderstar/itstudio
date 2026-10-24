import CabinetLayout from '@/Layouts/CabinetLayout';
import { Head, router } from '@inertiajs/react';

type NotificationRow = {
    id: string;
    data: Record<string, unknown>;
    read_at: string | null;
    created_at: string | null;
};

export default function NotificationsIndex({
    notifications,
}: {
    notifications: { data: NotificationRow[] };
}) {
    return (
        <CabinetLayout header={<h2 className="text-xl font-semibold">Уведомления</h2>}>
            <Head title="Уведомления" />
            <div className="mx-auto max-w-3xl px-4 py-8 sm:px-6 lg:px-8">
                <div className="mb-4 flex justify-end">
                    <button
                        type="button"
                        className="text-sm underline"
                        onClick={() => router.post(route('cabinet.notifications.read-all'))}
                    >
                        Отметить все прочитанными
                    </button>
                </div>
                <ul className="space-y-2">
                    {notifications.data.length === 0 && (
                        <li className="text-sm text-slate-500">Пока пусто.</li>
                    )}
                    {notifications.data.map((n) => (
                        <li
                            key={n.id}
                            className={`rounded-xl border px-4 py-3 text-sm ${
                                n.read_at
                                    ? 'border-slate-200 bg-white text-slate-500'
                                    : 'border-slate-300 bg-white text-slate-800'
                            }`}
                        >
                            <div className="flex items-start justify-between gap-3">
                                <div>
                                    <p className="font-medium">
                                        {String(n.data.type ?? 'уведомление')}
                                    </p>
                                    <pre className="mt-1 whitespace-pre-wrap font-sans text-xs opacity-80">
                                        {JSON.stringify(n.data, null, 2)}
                                    </pre>
                                </div>
                                {!n.read_at && (
                                    <button
                                        type="button"
                                        className="shrink-0 text-xs underline"
                                        onClick={() =>
                                            router.post(route('cabinet.notifications.read', n.id))
                                        }
                                    >
                                        Прочитано
                                    </button>
                                )}
                            </div>
                        </li>
                    ))}
                </ul>
            </div>
        </CabinetLayout>
    );
}
