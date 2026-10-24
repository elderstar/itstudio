import SectionBackdrop from '@/Components/Home/SectionBackdrop';
import InputError from '@/Components/InputError';
import InputLabel from '@/Components/InputLabel';
import PrimaryButton from '@/Components/PrimaryButton';
import TextInput from '@/Components/TextInput';
import { PageProps } from '@/types';
import { useForm, usePage } from '@inertiajs/react';
import { FormEventHandler } from 'react';

type ContactForm = {
    name: string;
    email: string;
    phone: string;
    message: string;
    company: string;
};

export default function ContactSection() {
    const { flash } = usePage<PageProps & { flash?: { lead_status?: string } }>().props;
    const { data, setData, post, processing, errors, reset, recentlySuccessful } =
        useForm<ContactForm>({
            name: '',
            email: '',
            phone: '',
            message: '',
            company: '',
        });

    const submit: FormEventHandler = (event) => {
        event.preventDefault();
        post(route('leads.store'), {
            preserveScroll: true,
            onSuccess: () => reset('name', 'email', 'phone', 'message', 'company'),
        });
    };

    const show_success = flash?.lead_status === 'sent' || recentlySuccessful;

    return (
        <section id="contact" className="relative isolate overflow-hidden py-24 sm:py-28">
            <SectionBackdrop variant="contact" />
            <div className="relative mx-auto max-w-xl px-6 lg:px-10">
                <h2 className="font-display text-4xl font-semibold tracking-tight text-ink sm:text-5xl">
                    Обсудим ваш проект
                </h2>
                <p className="mt-4 text-lg text-muted">
                    Кратко опишите задачу — ответим и предложим следующий шаг.
                </p>

                {show_success && (
                    <div
                        className="mt-8 rounded-2xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-800"
                        role="status"
                    >
                        Заявка отправлена. Мы свяжемся с вами в ближайшее время.
                    </div>
                )}

                <form
                    onSubmit={submit}
                    className="mt-10 space-y-5 rounded-[1.75rem] bg-surface p-6 shadow-[0_20px_50px_-28px_rgba(18,20,26,0.35)] ring-1 ring-ink/5 sm:p-8"
                >
                    <div>
                        <InputLabel htmlFor="name" value="Имя" className="text-ink" />
                        <TextInput
                            id="name"
                            className="mt-2 block w-full border-ink/10 bg-canvas text-ink focus:border-coral-400 focus:ring-coral-400"
                            value={data.name}
                            onChange={(event) => setData('name', event.target.value)}
                            required
                            autoComplete="name"
                        />
                        <InputError className="mt-2" message={errors.name} />
                    </div>

                    <div className="grid gap-5 sm:grid-cols-2">
                        <div>
                            <InputLabel htmlFor="email" value="Email" className="text-ink" />
                            <TextInput
                                id="email"
                                type="email"
                                className="mt-2 block w-full border-ink/10 bg-canvas text-ink focus:border-coral-400 focus:ring-coral-400"
                                value={data.email}
                                onChange={(event) => setData('email', event.target.value)}
                                required
                                autoComplete="email"
                            />
                            <InputError className="mt-2" message={errors.email} />
                        </div>
                        <div>
                            <InputLabel htmlFor="phone" value="Телефон" className="text-ink" />
                            <TextInput
                                id="phone"
                                type="tel"
                                className="mt-2 block w-full border-ink/10 bg-canvas text-ink focus:border-coral-400 focus:ring-coral-400"
                                value={data.phone}
                                onChange={(event) => setData('phone', event.target.value)}
                                autoComplete="tel"
                            />
                            <InputError className="mt-2" message={errors.phone} />
                        </div>
                    </div>

                    <div>
                        <InputLabel htmlFor="message" value="Сообщение" className="text-ink" />
                        <textarea
                            id="message"
                            rows={5}
                            className="mt-2 block w-full rounded-md border-ink/10 bg-canvas text-ink shadow-sm focus:border-coral-400 focus:ring-coral-400"
                            value={data.message}
                            onChange={(event) => setData('message', event.target.value)}
                            required
                        />
                        <InputError className="mt-2" message={errors.message} />
                    </div>

                    <div className="hidden" aria-hidden="true">
                        <label htmlFor="company">Company</label>
                        <input
                            id="company"
                            value={data.company}
                            onChange={(event) => setData('company', event.target.value)}
                            tabIndex={-1}
                            autoComplete="off"
                        />
                    </div>

                    <PrimaryButton
                        className="rounded-2xl bg-coral-500 px-5 py-3 text-sm font-semibold text-white hover:bg-coral-400 focus:bg-coral-400 active:bg-coral-600"
                        disabled={processing}
                    >
                        Отправить заявку
                    </PrimaryButton>
                </form>
            </div>
        </section>
    );
}
