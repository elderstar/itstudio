import ExperienceSlider from '@/Components/Coder/ExperienceSlider';
import ResumePicker from '@/Components/Coder/ResumePicker';
import SkillCheckboxes from '@/Components/Coder/SkillCheckboxes';
import InputError from '@/Components/InputError';
import InputLabel from '@/Components/InputLabel';
import PrimaryButton from '@/Components/PrimaryButton';
import TextInput from '@/Components/TextInput';
import GuestLayout from '@/Layouts/GuestLayout';
import { Head, Link, useForm } from '@inertiajs/react';
import { FormEventHandler } from 'react';

export default function Register({
    skillOptions,
    experienceLabels,
}: {
    skillOptions: string[];
    experienceLabels: Record<number, string>;
}) {
    const { data, setData, post, processing, errors, reset } = useForm({
        name: '',
        email: '',
        password: '',
        password_confirmation: '',
        bio: '',
        skills: [] as string[],
        experience_level: 33,
        resume_url: '',
        resume: null as File | null,
        nda_accepted: false,
    });

    const submit: FormEventHandler = (e) => {
        e.preventDefault();

        post(route('register'), {
            forceFormData: true,
            onFinish: () => reset('password', 'password_confirmation'),
        });
    };

    return (
        <GuestLayout wide>
            <Head title="Регистрация программиста" />

            <form onSubmit={submit} className="space-y-5">
                <div>
                    <h1 className="text-lg font-semibold text-slate-900">
                        Регистрация программиста
                    </h1>
                    <p className="mt-1 text-sm text-slate-600">
                        После модерации откроется лента заказов. Клиенты
                        подключаются через заявку на сайте.
                    </p>
                </div>

                <div>
                    <InputLabel htmlFor="name" value="Имя" />
                    <TextInput
                        id="name"
                        name="name"
                        value={data.name}
                        className="mt-1 block w-full"
                        autoComplete="name"
                        isFocused
                        onChange={(e) => setData('name', e.target.value)}
                        required
                    />
                    <InputError message={errors.name} className="mt-2" />
                </div>

                <div>
                    <InputLabel htmlFor="email" value="Email" />
                    <TextInput
                        id="email"
                        type="email"
                        name="email"
                        value={data.email}
                        className="mt-1 block w-full"
                        autoComplete="username"
                        onChange={(e) => setData('email', e.target.value)}
                        required
                    />
                    <InputError message={errors.email} className="mt-2" />
                </div>

                <div>
                    <InputLabel htmlFor="password" value="Пароль" />
                    <TextInput
                        id="password"
                        type="password"
                        name="password"
                        value={data.password}
                        className="mt-1 block w-full"
                        autoComplete="new-password"
                        onChange={(e) => setData('password', e.target.value)}
                        required
                    />
                    <InputError message={errors.password} className="mt-2" />
                </div>

                <div>
                    <InputLabel htmlFor="password_confirmation" value="Повтор пароля" />
                    <TextInput
                        id="password_confirmation"
                        type="password"
                        name="password_confirmation"
                        value={data.password_confirmation}
                        className="mt-1 block w-full"
                        autoComplete="new-password"
                        onChange={(e) =>
                            setData('password_confirmation', e.target.value)
                        }
                        required
                    />
                    <InputError
                        message={errors.password_confirmation}
                        className="mt-2"
                    />
                </div>

                <div>
                    <InputLabel value="Навыки" />
                    <div className="mt-2">
                        <SkillCheckboxes
                            options={skillOptions}
                            value={data.skills}
                            onChange={(skills) => setData('skills', skills)}
                            error={errors.skills}
                        />
                    </div>
                </div>

                <div>
                    <InputLabel value="Уровень" />
                    <div className="mt-3 px-1">
                        <ExperienceSlider
                            value={data.experience_level}
                            labels={experienceLabels}
                            onChange={(experience_level) =>
                                setData('experience_level', experience_level)
                            }
                        />
                    </div>
                    <InputError message={errors.experience_level} className="mt-2" />
                </div>

                <div>
                    <InputLabel htmlFor="bio" value="Кратко о себе" />
                    <textarea
                        id="bio"
                        value={data.bio}
                        onChange={(e) => setData('bio', e.target.value)}
                        rows={4}
                        required
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                        placeholder="Стек, опыт, чем интересен…"
                    />
                    <InputError message={errors.bio} className="mt-2" />
                </div>

                <div>
                    <InputLabel value="Резюме (опционально)" />
                    <div className="mt-2">
                        <ResumePicker
                            resumeUrl={data.resume_url}
                            onResumeUrlChange={(resume_url) =>
                                setData('resume_url', resume_url)
                            }
                            onFileChange={(resume) => setData('resume', resume)}
                            errorUrl={errors.resume_url}
                            errorFile={errors.resume}
                        />
                    </div>
                </div>

                <label className="flex items-start gap-2 text-sm text-slate-700">
                    <input
                        type="checkbox"
                        className="mt-1"
                        checked={data.nda_accepted}
                        onChange={(e) => setData('nda_accepted', e.target.checked)}
                        required
                    />
                    <span>Принимаю NDA и условия сотрудничества</span>
                </label>
                <InputError message={errors.nda_accepted} />

                <div className="flex items-center justify-end gap-4">
                    <Link
                        href={route('login')}
                        className="rounded-md text-sm text-gray-600 underline hover:text-gray-900"
                    >
                        Уже есть аккаунт?
                    </Link>
                    <PrimaryButton disabled={processing}>Зарегистрироваться</PrimaryButton>
                </div>
            </form>
        </GuestLayout>
    );
}
