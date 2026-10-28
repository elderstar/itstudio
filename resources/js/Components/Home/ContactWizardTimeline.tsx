import { motion, useReducedMotion } from 'motion/react';

type Props = {
    step: 1 | 2 | 3 | 4;
    labels: [string, string, string, string];
    onGoto?: (step: 1 | 2 | 3 | 4) => void;
};

export default function ContactWizardTimeline({ step, labels, onGoto }: Props) {
    const reduce = useReducedMotion();
    const progress = ((step - 1) / 3) * 100;

    return (
        <nav aria-label="Шаги заявки" className="mb-8">
            <div className="relative px-1 pt-1">
                <div className="absolute left-[12.5%] right-[12.5%] top-[15px] h-0.5 bg-ink/10" />
                <motion.div
                    className="absolute left-[12.5%] top-[15px] h-0.5 origin-left bg-coral-500"
                    style={{ width: '75%' }}
                    initial={false}
                    animate={{ scaleX: progress / 100 }}
                    transition={
                        reduce
                            ? { duration: 0 }
                            : { duration: 0.45, ease: [0.16, 1, 0.3, 1] }
                    }
                />

                <ol className="relative grid grid-cols-4 gap-1">
                    {labels.map((label, index) => {
                        const n = (index + 1) as 1 | 2 | 3 | 4;
                        const done = n < step;
                        const current = n === step;
                        const clickable = done && onGoto;

                        return (
                            <li key={label + n} className="flex flex-col items-center text-center">
                                <button
                                    type="button"
                                    disabled={!clickable}
                                    onClick={() => clickable && onGoto(n)}
                                    className={`flex h-8 w-8 items-center justify-center rounded-full text-xs font-semibold transition ${
                                        current || done
                                            ? 'bg-coral-500 text-white'
                                            : 'bg-surface text-muted ring-1 ring-ink/10'
                                    } ${clickable ? 'cursor-pointer hover:bg-coral-400' : 'cursor-default'}`}
                                    aria-current={current ? 'step' : undefined}
                                >
                                    <motion.span
                                        key={done ? `done-${n}` : `num-${n}`}
                                        initial={reduce ? false : { scale: 0.85, opacity: 0.6 }}
                                        animate={{ scale: 1, opacity: 1 }}
                                        transition={{ duration: 0.2 }}
                                    >
                                        {done ? '✓' : n}
                                    </motion.span>
                                </button>
                                <span
                                    className={`mt-2 max-w-[5.5rem] text-[11px] leading-tight sm:max-w-none sm:text-xs ${
                                        current ? 'font-semibold text-ink' : 'text-muted'
                                    }`}
                                >
                                    {label}
                                </span>
                            </li>
                        );
                    })}
                </ol>
            </div>
        </nav>
    );
}
