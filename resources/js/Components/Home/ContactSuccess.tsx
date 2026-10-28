import { motion, useReducedMotion } from 'motion/react';

export default function ContactSuccess() {
    const reduce = useReducedMotion();

    return (
        <motion.div
            className="mt-8 rounded-[1.75rem] bg-surface p-8 text-center shadow-[0_20px_50px_-28px_rgba(18,20,26,0.35)] ring-1 ring-ink/5 sm:p-10"
            initial={reduce ? false : { opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
            role="status"
        >
            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-coral-50">
                <svg
                    viewBox="0 0 48 48"
                    className="h-8 w-8 text-coral-500"
                    fill="none"
                    aria-hidden
                >
                    <motion.path
                        d="M12 24.5 L20.5 33 L36 15"
                        stroke="currentColor"
                        strokeWidth="3.5"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        initial={reduce ? false : { pathLength: 0, opacity: 0 }}
                        animate={{ pathLength: 1, opacity: 1 }}
                        transition={{ duration: 0.55, ease: [0.16, 1, 0.3, 1], delay: 0.1 }}
                    />
                </svg>
            </div>
            <h3 className="font-display mt-5 text-2xl font-semibold text-ink">Спасибо</h3>
            <p className="mx-auto mt-3 max-w-sm text-sm leading-relaxed text-muted">
                Прочитаем вашу ситуацию и напишем не шаблоном — с вопросами или гипотезой
                следующего шага.
            </p>
        </motion.div>
    );
}
