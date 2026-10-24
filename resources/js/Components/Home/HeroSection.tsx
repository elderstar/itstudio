type HeroSectionProps = {
    hero_image: string;
};

export default function HeroSection({ hero_image }: HeroSectionProps) {
    return (
        <section className="relative isolate min-h-[92vh] overflow-hidden hero-mesh px-6 pt-24 pb-16 lg:px-10">
            <div className="mx-auto grid max-w-7xl items-center gap-12 lg:grid-cols-2 lg:gap-16">
                <div className="max-w-xl pt-6 lg:pt-10">
                    <p className="inline-flex rounded-full bg-coral-100 px-3 py-1 text-sm font-semibold text-coral-600">
                        Открыты к новым проектам
                    </p>
                    <h1 className="font-display mt-6 text-5xl font-semibold tracking-tight text-ink sm:text-6xl lg:text-[4.25rem] lg:leading-[1.05]">
                        Цифровые продукты, которые работают на вас
                    </h1>
                    <p className="mt-6 max-w-md text-lg leading-relaxed text-muted">
                        CodeNebula — сайты, приложения и игры на Unreal Engine 5. Чистый код,
                        ясный процесс и результат без хаоса правок.
                    </p>
                    <div className="mt-9 flex flex-wrap items-center gap-4">
                        <a
                            href="#contact"
                            className="rounded-2xl bg-coral-500 px-5 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-coral-400"
                        >
                            Обсудить проект
                        </a>
                        <a
                            href="#services"
                            className="rounded-2xl border border-ink/10 bg-surface/70 px-5 py-3 text-sm font-semibold text-ink backdrop-blur transition hover:border-ink/20"
                        >
                            Смотреть услуги
                        </a>
                    </div>
                </div>

                <div className="relative mx-auto w-full max-w-lg lg:max-w-none">
                    <div className="absolute -inset-6 rounded-[2rem] bg-gradient-to-br from-coral-200/60 via-cyan-100/50 to-transparent blur-2xl" />
                    <img
                        src={hero_image}
                        alt=""
                        className="relative aspect-[4/5] w-full rounded-[1.75rem] object-cover shadow-[0_24px_60px_-20px_rgba(18,20,26,0.35)] ring-1 ring-ink/5"
                    />
                    <div className="absolute -bottom-4 left-4 right-4 rounded-2xl border border-white/60 bg-surface/90 px-4 py-3 shadow-lg backdrop-blur sm:left-8 sm:right-auto sm:max-w-xs">
                        <p className="text-sm font-semibold text-ink">Web · Apps · Unreal Engine 5</p>
                        <p className="mt-0.5 text-sm text-muted">От идеи до запуска под ключ</p>
                    </div>
                </div>
            </div>
        </section>
    );
}
