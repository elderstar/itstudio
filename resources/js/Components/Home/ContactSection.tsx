import ContactChipGroup from '@/Components/Home/ContactChipGroup';
import ContactSuccess from '@/Components/Home/ContactSuccess';
import ContactWizardTimeline from '@/Components/Home/ContactWizardTimeline';
import SectionBackdrop from '@/Components/Home/SectionBackdrop';
import {
    BRANCH,
    INTENTS,
    IntentId,
    WizardStep,
    composeLeadMessage,
    timelineLabels,
} from '@/Components/Home/contactWizardConfig';
import InputError from '@/Components/InputError';
import InputLabel from '@/Components/InputLabel';
import PrimaryButton from '@/Components/PrimaryButton';
import TextInput from '@/Components/TextInput';
import { PageProps } from '@/types';
import { useForm, usePage } from '@inertiajs/react';
import { AnimatePresence, motion, useReducedMotion } from 'motion/react';
import { FormEventHandler, useMemo, useState } from 'react';

type ContactForm = {
    name: string;
    email: string;
    phone: string;
    message: string;
    company: string;
    intent: IntentId | '';
    step2_chips: string[];
    step2_note: string;
    step3_chips: string[];
    step3_note: string;
    skipped_step3: boolean;
};

const ease = [0.16, 1, 0.3, 1] as const;

export default function ContactSection() {
    const { flash } =
        usePage<PageProps & { flash?: { lead_status?: string } }>().props;
    const reduce = useReducedMotion();
    const [step, setStep] = useState<WizardStep>(1);
    const [direction, setDirection] = useState(1);

    const {
        data,
        setData,
        post,
        processing,
        errors,
        reset,
        recentlySuccessful,
        transform,
    } = useForm<ContactForm>({
        name: '',
        email: '',
        phone: '',
        message: '',
        company: '',
        intent: '',
        step2_chips: [],
        step2_note: '',
        step3_chips: [],
        step3_note: '',
        skipped_step3: false,
    });

    const show_success = flash?.lead_status === 'sent' || recentlySuccessful;
    const intent = (data.intent || null) as IntentId | null;
    const branch = intent ? BRANCH[intent] : null;
    const labels = useMemo(() => timelineLabels(intent), [intent]);

    const goTo = (next: WizardStep) => {
        setDirection(next > step ? 1 : -1);
        setStep(next);
    };

    const canContinueStep2 =
        data.step2_chips.length > 0 || data.step2_note.trim().length > 0;

    const canSubmit =
        data.name.trim().length > 0 &&
        (data.email.trim().length > 0 || data.phone.trim().length > 0);

    const submit: FormEventHandler = (event) => {
        event.preventDefault();
        if (!intent) return;

        transform((form) => ({
            ...form,
            message: composeLeadMessage({
                intent: form.intent as IntentId,
                step2_chips: form.step2_chips,
                step2_note: form.step2_note,
                step3_chips: form.step3_chips,
                step3_note: form.step3_note,
                skipped_step3: form.skipped_step3,
            }),
        }));

        post(route('leads.store'), {
            preserveScroll: true,
            onSuccess: () => {
                reset();
                setStep(1);
                setDirection(1);
            },
        });
    };

    const variants = {
        enter: (dir: number) =>
            reduce
                ? { opacity: 0 }
                : { x: dir > 0 ? 28 : -28, opacity: 0 },
        center: { x: 0, opacity: 1 },
        exit: (dir: number) =>
            reduce
                ? { opacity: 0 }
                : { x: dir > 0 ? -28 : 28, opacity: 0 },
    };

    return (
        <section id="contact" className="relative isolate overflow-hidden py-24 sm:py-28">
            <SectionBackdrop variant="contact" />
            <div className="relative mx-auto max-w-xl px-6 lg:px-10">
                <h2 className="font-display text-4xl font-semibold tracking-tight text-ink sm:text-5xl">
                    Расскажите, с чем вы к нам пришли
                </h2>
                <p className="mt-4 text-lg text-muted">
                    Не нужен ТЗ. Хватит пары фраз о деле или о боли — предложим решение.
                </p>

                {show_success ? (
                    <ContactSuccess />
                ) : (
                    <form
                        onSubmit={submit}
                        className="mt-10 overflow-hidden rounded-[1.75rem] bg-surface p-6 shadow-[0_20px_50px_-28px_rgba(18,20,26,0.35)] ring-1 ring-ink/5 sm:p-8"
                    >
                        <ContactWizardTimeline
                            step={step}
                            labels={labels}
                            onGoto={(s) => goTo(s)}
                        />

                        <div className="relative min-h-[280px]">
                            <AnimatePresence mode="wait" custom={direction}>
                                <motion.div
                                    key={step}
                                    custom={direction}
                                    variants={variants}
                                    initial="enter"
                                    animate="center"
                                    exit="exit"
                                    transition={{ duration: reduce ? 0 : 0.32, ease }}
                                >
                                    {step === 1 && (
                                        <div className="space-y-4">
                                            <p className="text-sm font-medium text-ink">
                                                С чем вы пришли?
                                            </p>
                                            <div className="grid gap-3">
                                                {INTENTS.map((item) => {
                                                    const selected = data.intent === item.id;
                                                    return (
                                                        <button
                                                            key={item.id}
                                                            type="button"
                                                            onClick={() => {
                                                                setData({
                                                                    ...data,
                                                                    intent: item.id,
                                                                    step2_chips: [],
                                                                    step2_note: '',
                                                                    step3_chips: [],
                                                                    step3_note: '',
                                                                    skipped_step3: false,
                                                                });
                                                            }}
                                                            className={`rounded-2xl px-4 py-3.5 text-left transition ${
                                                                selected
                                                                    ? 'bg-coral-500 text-white shadow-sm'
                                                                    : 'bg-canvas text-ink ring-1 ring-ink/10 hover:ring-ink/20'
                                                            }`}
                                                        >
                                                            <span className="block text-sm font-semibold">
                                                                {item.title}
                                                            </span>
                                                            <span
                                                                className={`mt-0.5 block text-xs ${
                                                                    selected
                                                                        ? 'text-white/80'
                                                                        : 'text-muted'
                                                                }`}
                                                            >
                                                                {item.hint}
                                                            </span>
                                                        </button>
                                                    );
                                                })}
                                            </div>
                                            <InputError message={errors.intent} />
                                        </div>
                                    )}

                                    {step === 2 && branch && (
                                        <div className="space-y-4">
                                            <p className="text-sm font-medium text-ink">
                                                {branch.step2Prompt}
                                            </p>
                                            <ContactChipGroup
                                                key={`s2-${intent}`}
                                                options={branch.step2Chips}
                                                value={data.step2_chips}
                                                onChange={(step2_chips) =>
                                                    setData('step2_chips', step2_chips)
                                                }
                                            />
                                            <div>
                                                <InputLabel
                                                    htmlFor="step2_note"
                                                    value="Или своими словами"
                                                    className="text-ink"
                                                />
                                                <textarea
                                                    id="step2_note"
                                                    rows={3}
                                                    className="mt-2 block w-full rounded-xl border-ink/10 bg-canvas text-ink shadow-sm focus:border-coral-400 focus:ring-coral-400"
                                                    value={data.step2_note}
                                                    onChange={(e) =>
                                                        setData('step2_note', e.target.value)
                                                    }
                                                    placeholder="Пара фраз достаточно"
                                                />
                                            </div>
                                            <InputError
                                                message={
                                                    errors.step2_chips || errors.step2_note
                                                }
                                            />
                                        </div>
                                    )}

                                    {step === 3 && branch && (
                                        <div className="space-y-4">
                                            <p className="text-sm font-medium text-ink">
                                                {branch.step3Prompt}
                                            </p>
                                            <ContactChipGroup
                                                key={`s3-${intent}`}
                                                options={branch.step3Chips}
                                                value={data.step3_chips}
                                                onChange={(step3_chips) => {
                                                    setData('step3_chips', step3_chips);
                                                    setData('skipped_step3', false);
                                                }}
                                            />
                                            <div>
                                                <InputLabel
                                                    htmlFor="step3_note"
                                                    value="Уточнение"
                                                    className="text-ink"
                                                />
                                                <textarea
                                                    id="step3_note"
                                                    rows={3}
                                                    className="mt-2 block w-full rounded-xl border-ink/10 bg-canvas text-ink shadow-sm focus:border-coral-400 focus:ring-coral-400"
                                                    value={data.step3_note}
                                                    onChange={(e) => {
                                                        setData('step3_note', e.target.value);
                                                        setData('skipped_step3', false);
                                                    }}
                                                    placeholder="По желанию"
                                                />
                                            </div>
                                            <button
                                                type="button"
                                                className="text-sm text-muted underline decoration-ink/20 underline-offset-4 hover:text-ink"
                                                onClick={() => {
                                                    setData('skipped_step3', true);
                                                    setData('step3_chips', []);
                                                    setData('step3_note', '');
                                                    goTo(4);
                                                }}
                                            >
                                                {branch.step3SkipLabel}
                                            </button>
                                        </div>
                                    )}

                                    {step === 4 && (
                                        <div className="space-y-5">
                                            <p className="text-sm font-medium text-ink">
                                                Как к вам обратиться?
                                            </p>
                                            <div>
                                                <InputLabel
                                                    htmlFor="name"
                                                    value="Имя"
                                                    className="text-ink"
                                                />
                                                <TextInput
                                                    id="name"
                                                    className="mt-2 block w-full border-ink/10 bg-canvas text-ink focus:border-coral-400 focus:ring-coral-400"
                                                    value={data.name}
                                                    onChange={(e) =>
                                                        setData('name', e.target.value)
                                                    }
                                                    autoComplete="name"
                                                />
                                                <InputError
                                                    className="mt-2"
                                                    message={errors.name}
                                                />
                                            </div>
                                            <div className="grid gap-5 sm:grid-cols-2">
                                                <div>
                                                    <InputLabel
                                                        htmlFor="email"
                                                        value="Email"
                                                        className="text-ink"
                                                    />
                                                    <TextInput
                                                        id="email"
                                                        type="email"
                                                        className="mt-2 block w-full border-ink/10 bg-canvas text-ink focus:border-coral-400 focus:ring-coral-400"
                                                        value={data.email}
                                                        onChange={(e) =>
                                                            setData('email', e.target.value)
                                                        }
                                                        autoComplete="email"
                                                    />
                                                    <InputError
                                                        className="mt-2"
                                                        message={errors.email}
                                                    />
                                                </div>
                                                <div>
                                                    <InputLabel
                                                        htmlFor="phone"
                                                        value="Телефон"
                                                        className="text-ink"
                                                    />
                                                    <TextInput
                                                        id="phone"
                                                        type="tel"
                                                        className="mt-2 block w-full border-ink/10 bg-canvas text-ink focus:border-coral-400 focus:ring-coral-400"
                                                        value={data.phone}
                                                        onChange={(e) =>
                                                            setData('phone', e.target.value)
                                                        }
                                                        autoComplete="tel"
                                                    />
                                                    <InputError
                                                        className="mt-2"
                                                        message={errors.phone}
                                                    />
                                                </div>
                                            </div>
                                            <p className="text-xs text-muted">
                                                Достаточно email или телефона — как вам удобнее.
                                            </p>
                                            <InputError message={errors.message} />
                                        </div>
                                    )}
                                </motion.div>
                            </AnimatePresence>
                        </div>

                        <div className="hidden" aria-hidden="true">
                            <label htmlFor="company">Company</label>
                            <input
                                id="company"
                                value={data.company}
                                onChange={(e) => setData('company', e.target.value)}
                                tabIndex={-1}
                                autoComplete="off"
                            />
                        </div>

                        <div className="mt-8 flex items-center justify-between gap-3">
                            {step > 1 ? (
                                <button
                                    type="button"
                                    className="text-sm font-medium text-muted hover:text-ink"
                                    onClick={() => goTo((step - 1) as WizardStep)}
                                >
                                    Назад
                                </button>
                            ) : (
                                <span />
                            )}

                            {step < 4 ? (
                                <PrimaryButton
                                    type="button"
                                    className="rounded-2xl bg-coral-500 px-5 py-3 text-sm font-semibold text-white hover:bg-coral-400 focus:bg-coral-400 active:bg-coral-600"
                                    disabled={
                                        (step === 1 && !data.intent) ||
                                        (step === 2 && !canContinueStep2)
                                    }
                                    onClick={() => {
                                        if (step === 1 && data.intent) goTo(2);
                                        else if (step === 2 && canContinueStep2) goTo(3);
                                        else if (step === 3) goTo(4);
                                    }}
                                >
                                    Далее
                                </PrimaryButton>
                            ) : (
                                <PrimaryButton
                                    className="rounded-2xl bg-coral-500 px-5 py-3 text-sm font-semibold text-white hover:bg-coral-400 focus:bg-coral-400 active:bg-coral-600"
                                    disabled={processing || !canSubmit}
                                >
                                    Отправить
                                </PrimaryButton>
                            )}
                        </div>
                    </form>
                )}
            </div>
        </section>
    );
}
