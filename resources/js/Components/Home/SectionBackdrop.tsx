type SectionBackdropProps = {
    variant?: 'services' | 'about' | 'process' | 'contact';
};

const variants: Record<NonNullable<SectionBackdropProps['variant']>, string> = {
    services: 'section-bg-services',
    about: 'section-bg-about',
    process: 'section-bg-process',
    contact: 'section-bg-contact',
};

export default function SectionBackdrop({ variant = 'services' }: SectionBackdropProps) {
    return (
        <div
            aria-hidden="true"
            className={`pointer-events-none absolute inset-0 -z-10 ${variants[variant]}`}
        />
    );
}
