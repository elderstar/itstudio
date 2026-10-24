import OrderTabs from '@/Components/Cabinet/OrderTabs';
import CabinetLayout from '@/Layouts/CabinetLayout';
import { Head, useForm } from '@inertiajs/react';
import { FormEvent } from 'react';

type FileRow = {
    id: number;
    name: string;
    size: number;
    mime_type: string | null;
    created_at: string | null;
    url: string;
};

export default function OrderFiles({
    order,
    files,
}: {
    order: { id: number; title: string };
    files: FileRow[];
}) {
    const form = useForm<{ file: File | null }>({ file: null });

    const submit = (e: FormEvent) => {
        e.preventDefault();
        form.post(route('cabinet.orders.files.store', order.id), {
            forceFormData: true,
            onSuccess: () => form.reset(),
        });
    };

    return (
        <CabinetLayout header={<h2 className="text-xl font-semibold">{order.title} — файлы</h2>}>
            <Head title={`Файлы · ${order.title}`} />
            <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
                <OrderTabs orderId={order.id} active="files" />

                <form onSubmit={submit} className="mb-6 flex flex-wrap items-end gap-3 rounded-xl border border-slate-200 bg-white p-4">
                    <input
                        type="file"
                        required
                        onChange={(e) => form.setData('file', e.target.files?.[0] ?? null)}
                    />
                    <button
                        type="submit"
                        disabled={form.processing}
                        className="rounded-md bg-slate-900 px-4 py-2 text-sm text-white"
                    >
                        Загрузить
                    </button>
                </form>

                <ul className="space-y-2">
                    {files.length === 0 && (
                        <li className="text-sm text-slate-500">Файлов пока нет.</li>
                    )}
                    {files.map((file) => (
                        <li
                            key={file.id}
                            className="flex items-center justify-between rounded-lg border border-slate-200 bg-white px-4 py-3 text-sm"
                        >
                            <span>{file.name}</span>
                            <a href={file.url} className="text-slate-700 underline">
                                Скачать
                            </a>
                        </li>
                    ))}
                </ul>
            </div>
        </CabinetLayout>
    );
}
