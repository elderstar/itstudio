type Props = {
    value: number;
    labels: Record<number, string>;
    onChange: (value: number) => void;
};

export default function ExperienceSlider({ value, labels, onChange }: Props) {
    const stops = Object.keys(labels)
        .map(Number)
        .sort((a, b) => a - b);

    return (
        <div>
            <input
                type="range"
                min={0}
                max={100}
                step={1}
                value={value}
                onChange={(e) => onChange(Number(e.target.value))}
                className="w-full accent-slate-900"
                aria-label="Уровень опыта"
            />
            <div className="relative mt-2 h-5">
                {stops.map((stop) => (
                    <span
                        key={stop}
                        className="absolute -translate-x-1/2 text-xs text-slate-500"
                        style={{ left: `${stop}%` }}
                    >
                        {labels[stop]}
                    </span>
                ))}
            </div>
        </div>
    );
}
