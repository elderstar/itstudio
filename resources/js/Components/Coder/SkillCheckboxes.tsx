type Props = {
    options: string[];
    value: string[];
    onChange: (skills: string[]) => void;
    error?: string;
};

export default function SkillCheckboxes({ options, value, onChange, error }: Props) {
    const toggle = (skill: string) => {
        if (value.includes(skill)) {
            onChange(value.filter((s) => s !== skill));
        } else {
            onChange([...value, skill]);
        }
    };

    return (
        <div>
            <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
                {options.map((skill) => {
                    const checked = value.includes(skill);
                    return (
                        <label
                            key={skill}
                            className={`flex cursor-pointer items-center gap-2 rounded-md border px-3 py-2 text-sm ${
                                checked
                                    ? 'border-slate-900 bg-slate-900 text-white'
                                    : 'border-slate-300 bg-white text-slate-700'
                            }`}
                        >
                            <input
                                type="checkbox"
                                className="sr-only"
                                checked={checked}
                                onChange={() => toggle(skill)}
                            />
                            {skill}
                        </label>
                    );
                })}
            </div>
            {error && <p className="mt-1 text-sm text-red-600">{error}</p>}
        </div>
    );
}
