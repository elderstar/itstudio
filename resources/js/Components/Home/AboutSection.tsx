import SectionBackdrop from '@/Components/Home/SectionBackdrop';
import { useEffect, useRef, useState } from 'react';

type AboutSectionProps = {
    about_images: string[];
};

const panels = [
    {
        title: 'Подготовка к работе',
        body: [
            'Любому цифровому продукту нужен продуманный фундамент.',
            'Уточнение деталей на старте, ТЗ и оценка рисков — страховка от переделок и скрытых расходов.',
        ],
    },
    {
        title: 'Что учитываем в плане',
        body: [
            'Реальные сроки, бюджет без сюрпризов и риски интеграций — до старта разработки.',
        ],
    },
    {
        title: 'Что даёт такой подход',
        body: [
            'Вы контролируете процесс и видите, за что платите. Проект соответствует целям бизнеса.',
        ],
    },
    {
        title: 'Лучше день на ТЗ',
        body: [
            'Лучше потратить 2 дня на ТЗ, чем 2 месяца на переделку готового продукта.',
        ],
    },
];

export default function AboutSection({ about_images }: AboutSectionProps) {
    const section_ref = useRef<HTMLElement | null>(null);
    const [active_index, setActiveIndex] = useState(0);

    useEffect(() => {
        const onScroll = () => {
            const section = section_ref.current;
            if (!section || about_images.length === 0) {
                return;
            }

            const rect = section.getBoundingClientRect();
            const viewport = window.innerHeight || 1;
            const total = Math.max(rect.height - viewport, 1);
            const scrolled = Math.min(Math.max(-rect.top, 0), total);
            const progress = scrolled / total;
            const next_index = Math.min(
                about_images.length - 1,
                Math.floor(progress * about_images.length),
            );

            setActiveIndex((current) => (current === next_index ? current : next_index));
        };

        onScroll();
        window.addEventListener('scroll', onScroll, { passive: true });
        window.addEventListener('resize', onScroll);

        return () => {
            window.removeEventListener('scroll', onScroll);
            window.removeEventListener('resize', onScroll);
        };
    }, [about_images.length]);

    return (
        <section
            id="about"
            ref={section_ref}
            className="relative isolate px-6 py-24 sm:py-28 lg:px-10"
        >
            <SectionBackdrop variant="about" />
            <div className="relative mx-auto grid max-w-7xl grid-cols-1 items-start gap-12 lg:grid-cols-2 lg:gap-16">
                <div className="space-y-28 lg:space-y-40">
                    <h2 className="font-display text-4xl font-semibold tracking-tight text-ink sm:text-5xl">
                        Прозрачная подготовка
                    </h2>
                    {panels.map((panel) => (
                        <article key={panel.title} className="max-w-xl">
                            <h3 className="font-display text-3xl font-semibold tracking-tight text-ink">
                                {panel.title}
                            </h3>
                            <div className="mt-5 space-y-3 text-lg leading-relaxed text-muted">
                                {panel.body.map((paragraph) => (
                                    <p key={paragraph}>{paragraph}</p>
                                ))}
                            </div>
                        </article>
                    ))}
                </div>

                <div className="sticky top-24 hidden h-[min(70vh,36rem)] self-start lg:block">
                    <div className="relative h-full overflow-hidden rounded-[1.75rem] bg-canvas shadow-[0_20px_50px_-24px_rgba(18,20,26,0.35)] ring-1 ring-ink/5">
                        {about_images.map((src, index) => (
                            <img
                                key={src}
                                src={src}
                                alt=""
                                className={`absolute inset-0 h-full w-full object-cover transition-opacity duration-500 ease-out ${
                                    active_index === index ? 'opacity-100' : 'opacity-0'
                                }`}
                            />
                        ))}
                    </div>
                </div>

                <div className="lg:hidden">
                    <img
                        src={about_images[active_index] ?? about_images[0]}
                        alt=""
                        className="aspect-[4/3] w-full rounded-2xl object-cover shadow-lg ring-1 ring-ink/5"
                    />
                </div>
            </div>
        </section>
    );
}
