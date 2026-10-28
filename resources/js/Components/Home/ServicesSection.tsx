import SectionBackdrop from '@/Components/Home/SectionBackdrop';

/*
 * TODO(services-marks): заменить текстовые mark ('Web' / 'Fast' / 'Safe' / 'UE5') на визуальные знаки.
 *
 * Сделать:
 *   - сгенерировать или нарисовать 4 иконки/изображения (SVG предпочтительно; webp — если нужен
 *     объём/иллюстрация, не line-icon);
 *   - единый стиль под бренд (coral/cyan, airy, без generic purple SaaS-набора);
 *   - положить в /public/imgs/services/ (или resources/js/Components/Home/icons/) и подключить
 *     вместо {service.mark} — <img> / inline SVG / компонент иконки;
 *   - сохранить tint-подложку или заменить на soft-circle вокруг иконки;
 *   - alt по смыслу услуги (не пустой), размеры фиксированные (напр. 40–48px).
 *
 * Пока mark остаётся временным текстовым бейджем.
 */
const services = [
    {
        title: 'Сайты и лендинги',
        body: 'Быстрые адаптивные сайты с понятной структурой и удобной админкой.',
        tint: 'bg-cyan-100 text-cyan-700',
        mark: 'Web', // TODO: → icon/webp
    },
    {
        title: 'Производительность',
        body: 'Оптимизация загрузки, кеширование и архитектура без лишнего веса.',
        tint: 'bg-coral-100 text-coral-600',
        mark: 'Fast', // TODO: → icon/webp
    },
    {
        title: 'Безопасность',
        body: 'Валидация, защита форм и аккуратные интеграции с первого дня.',
        tint: 'bg-cyan-100 text-cyan-700',
        mark: 'Safe', // TODO: → icon/webp
    },
    {
        title: 'Приложения и UE5',
        body: 'Веб- и мобильные приложения, прототипы и механики на Unreal Engine 5.',
        tint: 'bg-coral-100 text-coral-600',
        mark: 'UE5', // TODO: → icon/webp
    },
];

export default function ServicesSection() {
    return (
        <section id="services" className="relative isolate overflow-hidden py-24 sm:py-28">
            <SectionBackdrop variant="services" />
            <div className="relative mx-auto max-w-7xl px-6 lg:px-10">
                <h2 className="font-display max-w-2xl text-4xl font-semibold tracking-tight text-ink sm:text-5xl">
                    Всё для цифрового продукта
                </h2>
                <p className="mt-4 max-w-xl text-lg text-muted">
                    От лендинга до платформы и игрового прототипа — собираем решение под цель бизнеса.
                </p>

                <div className="mt-14 grid gap-x-10 gap-y-12 sm:grid-cols-2">
                    {services.map((service) => (
                        <article key={service.title} className="max-w-md">
                            <span
                                className={`inline-flex rounded-xl px-3 py-1.5 text-sm font-semibold ${service.tint}`}
                            >
                                {service.mark}
                            </span>
                            <h3 className="font-display mt-5 text-2xl font-semibold tracking-tight text-ink">
                                {service.title}
                            </h3>
                            <p className="mt-3 text-base leading-relaxed text-muted">{service.body}</p>
                        </article>
                    ))}
                </div>
            </div>
        </section>
    );
}
