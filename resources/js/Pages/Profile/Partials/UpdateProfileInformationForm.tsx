import ExperienceSlider from '@/Components/Coder/ExperienceSlider';
import ResumePicker from '@/Components/Coder/ResumePicker';
import SkillCheckboxes from '@/Components/Coder/SkillCheckboxes';
import InputError from '@/Components/InputError';
import InputLabel from '@/Components/InputLabel';
import PrimaryButton from '@/Components/PrimaryButton';
import TextInput from '@/Components/TextInput';
import { Transition } from '@headlessui/react';
import { Link, useForm, usePage } from '@inertiajs/react';
import { FormEventHandler, useState } from 'react';

type CoderProfile = {
    bio: string | null;
    skills: string[];
    experience_level: number;
    resume_url: string | null;
    resume_file_name: string | null;
    resume_file_url: string | null;
    status: string;
    status_label: string;
};

export default function UpdateProfileInformation({
    mustVerifyEmail,
    status,
    className = '',
    coderProfile = null,
    skillOptions = [],
    experienceLabels = {},
}: {
    mustVerifyEmail: boolean;
    status?: string;
    className?: string;
    coderProfile?: CoderProfile | null;
    skillOptions?: string[];
    experienceLabels?: Record<number, string>;
}) {
    const user = usePage().props.auth.user!;
    const isCoder = Boolean(coderProfile) || (user.roles ?? []).includes('coder');
    const [clearResumeFile, setClearResumeFile] = useState(false);

    const { data, setData, post, errors, processing, recentlySuccessful, transform } =
        useForm({
            _method: 'patch' as const,
            name: user.name,
            email: user.email,
            bio: coderProfile?.bio ?? '',
            skills: coderProfile?.skills ?? ([] as string[]),
            experience_level: coderProfile?.experience_level ?? 33,
            resume_url: coderProfile?.resume_url ?? '',
            resume: null as File | null,
            clear_resume_file: false as boolean,
        });

    const submit: FormEventHandler = (e) => {
        e.preventDefault();
        transform((form) => ({
            ...form,
            clear_resume_file: clearResumeFile,
        }));
        post(route('profile.update'), {
            forceFormData: true,
            onSuccess: () => {
                setData('resume', null);
                setClearResumeFile(false);
            },
        });
    };

    return (
        <section className={className}>
            <header>
                <h2 className="text-lg font-medium text-gray-900">Профиль</h2>
                <p className="mt-1 text-sm text-gray-600">
                    {isCoder
                        ? 'Имя, контакты и анкета программиста — навыки, уровень, резюме.'
                        : 'Имя и email аккаунта.'}
                </p>
                {coderProfile && (
                    <p className="mt-2 text-sm text-slate-500">
                        Статус анкеты: {coderProfile.status_label}
                    </p>
                )}
            </header>

            <form onSubmit={submit} className="mt-6 space-y-6">
                <div>
                    <InputLabel htmlFor="name" value="Имя" />
                    <TextInput
                        id="name"
                        className="mt-1 block w-full"
                        value={data.name}
                        onChange={(e) => setData('name', e.target.value)}
                        required
                        isFocused
                        autoComplete="name"
                    />
                    <InputError className="mt-2" message={errors.name} />
                </div>

                <div>
                    <InputLabel htmlFor="email" value="Email" />
                    <TextInput
                        id="email"
                        type="email"
                        className="mt-1 block w-full"
                        value={data.email}
                        onChange={(e) => setData('email', e.target.value)}
                        required
                        autoComplete="username"
                    />
                    <InputError className="mt-2" message={errors.email} />
                </div>

                {mustVerifyEmail && user.email_verified_at === null && (
                    <div>
                        <p className="mt-2 text-sm text-gray-800">
                            Email не подтверждён.{' '}
                            <Link
                                href={route('verification.send')}
                                method="post"
                                as="button"
                                className="rounded-md text-sm text-gray-600 underline hover:text-gray-900"
                            >
                                Отправить письмо ещё раз
                            </Link>
                        </p>
                        {status === 'verification-link-sent' && (
                            <div className="mt-2 text-sm font-medium text-green-600">
                                Новая ссылка отправлена на email.
                            </div>
                        )}
                    </div>
                )}

                {isCoder && (
                    <>
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
                            <InputError
                                className="mt-2"
                                message={errors.experience_level}
                            />
                        </div>

                        <div>
                            <InputLabel htmlFor="bio" value="Кратко о себе" />
                            <textarea
                                id="bio"
                                value={data.bio}
                                onChange={(e) => setData('bio', e.target.value)}
                                rows={5}
                                required
                                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                            />
                            <InputError className="mt-2" message={errors.bio} />
                        </div>

                        <div>
                            <InputLabel value="Резюме" />
                            <div className="mt-2">
                                <ResumePicker
                                    resumeUrl={data.resume_url}
                                    onResumeUrlChange={(resume_url) =>
                                        setData('resume_url', resume_url)
                                    }
                                    onFileChange={(resume) => {
                                        setData('resume', resume);
                                        if (resume) setClearResumeFile(false);
                                    }}
                                    fileName={
                                        clearResumeFile
                                            ? null
                                            : coderProfile?.resume_file_name
                                    }
                                    fileUrl={
                                        clearResumeFile
                                            ? null
                                            : coderProfile?.resume_file_url
                                    }
                                    errorUrl={errors.resume_url}
                                    errorFile={errors.resume}
                                />
                            </div>
                            {coderProfile?.resume_file_name && !clearResumeFile && (
                                <button
                                    type="button"
                                    className="mt-2 text-sm text-slate-500 underline"
                                    onClick={() => {
                                        setClearResumeFile(true);
                                        setData('resume', null);
                                    }}
                                >
                                    Удалить загруженный файл
                                </button>
                            )}
                        </div>
                    </>
                )}

                <div className="flex items-center gap-4">
                    <PrimaryButton disabled={processing}>Сохранить</PrimaryButton>
                    <Transition
                        show={recentlySuccessful}
                        enter="transition ease-in-out"
                        enterFrom="opacity-0"
                        leave="transition ease-in-out"
                        leaveTo="opacity-0"
                    >
                        <p className="text-sm text-gray-600">Сохранено.</p>
                    </Transition>
                </div>
            </form>
        </section>
    );
}
