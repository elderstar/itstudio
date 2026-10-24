import OrderTabs from '@/Components/Cabinet/OrderTabs';
import CabinetLayout from '@/Layouts/CabinetLayout';
import { Head, router, usePage } from '@inertiajs/react';
import { FormEvent, useEffect, useRef, useState } from 'react';

type ChatUser = { id: number; name: string; avatar_url?: string | null };
type ChatMessage = {
    id: number;
    body: string;
    created_at: string | null;
    user: ChatUser;
    parent: { id: number; body: string; user: ChatUser } | null;
    attachments: { id: number; name: string; url: string }[];
};

export default function OrderChat({
    order,
    messages,
}: {
    order: { id: number; title: string };
    messages: { data: ChatMessage[] };
}) {
    const authUser = usePage().props.auth.user!;
    const [items, setItems] = useState<ChatMessage[]>([...messages.data].reverse());
    const [body, setBody] = useState('');
    const [replyTo, setReplyTo] = useState<ChatMessage | null>(null);
    const [file, setFile] = useState<File | null>(null);
    const bottomRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [items.length]);

    useEffect(() => {
        const channel = window.Echo.private(`orders.${order.id}`).listen(
            '.message.sent',
            (payload: ChatMessage) => {
                setItems((prev) =>
                    prev.some((m) => m.id === payload.id) ? prev : [...prev, payload],
                );
            },
        );

        return () => {
            window.Echo.leave(`orders.${order.id}`);
            channel.stopListening('.message.sent');
        };
    }, [order.id]);

    const submit = (e: FormEvent) => {
        e.preventDefault();
        if (!body.trim()) return;

        const form = new FormData();
        form.append('body', body);
        if (replyTo) form.append('parent_id', String(replyTo.id));
        if (file) form.append('attachment', file);

        router.post(route('cabinet.orders.chat.store', order.id), form, {
            forceFormData: true,
            preserveScroll: true,
            onSuccess: () => {
                setBody('');
                setReplyTo(null);
                setFile(null);
                router.reload({ only: ['messages'] });
            },
        });
    };

    useEffect(() => {
        setItems([...messages.data].reverse());
    }, [messages.data]);

    return (
        <CabinetLayout header={<h2 className="text-xl font-semibold">{order.title} — чат</h2>}>
            <Head title={`Чат · ${order.title}`} />
            <div className="mx-auto flex max-w-7xl flex-col px-4 py-8 sm:px-6 lg:px-8">
                <OrderTabs orderId={order.id} active="chat" />

                <div className="flex h-[65vh] flex-col rounded-xl border border-slate-200 bg-white">
                    <div className="flex-1 space-y-3 overflow-y-auto p-4">
                        {items.map((message) => (
                            <div
                                key={message.id}
                                className={`flex gap-3 ${
                                    message.user.id === authUser.id ? 'justify-end' : ''
                                }`}
                            >
                                {message.user.id !== authUser.id && (
                                    <Avatar user={message.user} />
                                )}
                                <div
                                    className={`max-w-[75%] rounded-lg px-3 py-2 text-sm ${
                                        message.user.id === authUser.id
                                            ? 'bg-slate-900 text-white'
                                            : 'bg-slate-100 text-slate-800'
                                    }`}
                                >
                                    <div className="mb-1 text-xs opacity-70">{message.user.name}</div>
                                    {message.parent && (
                                        <div className="mb-2 rounded bg-black/10 px-2 py-1 text-xs opacity-80">
                                            <strong>{message.parent.user.name}:</strong>{' '}
                                            {message.parent.body}
                                        </div>
                                    )}
                                    <p className="whitespace-pre-wrap">{message.body}</p>
                                    {message.attachments?.map((a) => (
                                        <a
                                            key={a.id}
                                            href={a.url}
                                            className="mt-1 block underline"
                                        >
                                            {a.name}
                                        </a>
                                    ))}
                                    <button
                                        type="button"
                                        className="mt-1 text-xs underline opacity-70"
                                        onClick={() => setReplyTo(message)}
                                    >
                                        Ответить
                                    </button>
                                </div>
                            </div>
                        ))}
                        <div ref={bottomRef} />
                    </div>

                    <form onSubmit={submit} className="border-t border-slate-200 p-3">
                        {replyTo && (
                            <div className="mb-2 flex items-center justify-between rounded bg-slate-50 px-2 py-1 text-xs">
                                <span>
                                    Ответ для {replyTo.user.name}: {replyTo.body.slice(0, 80)}
                                </span>
                                <button type="button" onClick={() => setReplyTo(null)}>
                                    ✕
                                </button>
                            </div>
                        )}
                        <div className="flex gap-2">
                            <input
                                type="file"
                                className="text-xs"
                                onChange={(e) => setFile(e.target.files?.[0] ?? null)}
                            />
                            <input
                                value={body}
                                onChange={(e) => setBody(e.target.value)}
                                className="flex-1 rounded-md border border-slate-300 px-3 py-2 text-sm"
                                placeholder="Сообщение…"
                            />
                            <button
                                type="submit"
                                className="rounded-md bg-slate-900 px-4 py-2 text-sm text-white"
                            >
                                Отправить
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </CabinetLayout>
    );
}

function Avatar({ user }: { user: ChatUser }) {
    if (user.avatar_url) {
        return (
            <img src={user.avatar_url} alt="" className="h-8 w-8 rounded-full object-cover" />
        );
    }
    return (
        <span className="flex h-8 w-8 items-center justify-center rounded-full bg-slate-200 text-xs">
            {user.name.slice(0, 1)}
        </span>
    );
}
