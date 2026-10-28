import { motion, useReducedMotion } from 'motion/react';

type Props = {
    options: string[];
    value: string[];
    onChange: (next: string[]) => void;
    stagger?: boolean;
};

export default function ContactChipGroup({
    options,
    value,
    onChange,
    stagger = true,
}: Props) {
    const reduce = useReducedMotion();

    const toggle = (chip: string) => {
        if (value.includes(chip)) {
            onChange(value.filter((v) => v !== chip));
        } else {
            onChange([...value, chip]);
        }
    };

    return (
        <div className="flex flex-wrap gap-2">
            {options.map((chip, index) => {
                const selected = value.includes(chip);

                return (
                    <motion.button
                        key={chip}
                        type="button"
                        onClick={() => toggle(chip)}
                        initial={reduce || !stagger ? false : { opacity: 0, y: 8 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={
                            reduce
                                ? { duration: 0 }
                                : {
                                      delay: stagger ? Math.min(index * 0.055, 0.35) : 0,
                                      duration: 0.28,
                                      ease: [0.16, 1, 0.3, 1],
                                  }
                        }
                        whileTap={reduce ? undefined : { scale: 0.97 }}
                        className={`rounded-2xl px-3.5 py-2 text-sm transition ${
                            selected
                                ? 'bg-coral-500 text-white shadow-sm'
                                : 'bg-canvas text-ink ring-1 ring-ink/10 hover:ring-ink/20'
                        }`}
                        aria-pressed={selected}
                    >
                        {chip}
                    </motion.button>
                );
            })}
        </div>
    );
}
