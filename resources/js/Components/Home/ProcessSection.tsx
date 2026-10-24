import SectionBackdrop from '@/Components/Home/SectionBackdrop';

const steps = [
    {
        title: 'Заявка',
        body: 'Оставляете форму — связываемся и уточняем удобный формат общения.',
    },
    {
        title: 'Консультация',
        body: 'Разбираем аудиторию, функционал, дизайн и бюджет.',
    },
    {
        title: 'ТЗ',
        body: 'Фиксируем цели, этапы, технологии и требования к безопасности.',
    },
    {
        title: 'Оценка',
        body: 'Сроки, стоимость и формат оплаты — затем договор и старт.',
    },
    {
        title: 'Разработка',
        body: 'Работаем по плану, показываем промежуточные версии.',
    },
    {
        title: 'Запуск',
        body: 'Тесты, обучение, передача материалов и гарантия 1–3 месяца.',
    },
];

export default function ProcessSection() {
    return (
        <section id="process" className="relative isolate overflow-hidden py-24 sm:py-28">
            <SectionBackdrop variant="process" />
            <div className="relative mx-auto max-w-7xl px-6 lg:px-10">
                <h2 className="font-display max-w-2xl text-4xl font-semibold tracking-tight text-ink sm:text-5xl">
                    Этапы работы
                </h2>
                <p className="mt-4 max-w-xl text-lg text-muted">
                    Понятный путь от заявки до запуска — без сюрпризов по ходу.
                </p>

                <ol className="mt-14 grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
                    {steps.map((step, index) => (
                        <li key={step.title}>
                            <span className="font-display text-4xl font-semibold tracking-tight text-coral-500">
                                {index + 1}
                            </span>
                            <h3 className="font-display mt-3 text-xl font-semibold text-ink">
                                {step.title}
                            </h3>
                            <p className="mt-2 text-base leading-relaxed text-muted">{step.body}</p>
                        </li>
                    ))}
                </ol>
            </div>
        </section>
    );
}
