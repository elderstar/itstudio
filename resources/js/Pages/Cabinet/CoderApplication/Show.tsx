import CabinetLayout from '@/Layouts/CabinetLayout';
import { Head, Link } from '@inertiajs/react';

type Application = {
    id: number;
    headline: string | null;
    bio: string | null;
    skills: string[];
    experience_level: number;
    resume_url: string | null;
    resume_file_name: string | null;
    resume_file_url: string | null;
    status: string;
    status_label: string;
    admin_note: string | null;
} | null;

export default function CoderApplicationShow({
    application,
}: {
    application: Application;
    can_create: boolean;
}) {
    return (
        <CabinetLayout header={<h2 className="text-xl font-semibold">Анкета кодера</h2>}>
            <Head title="Анкета кодера" />
            <div className="mx-auto max-w-2xl px-4 py-8 sm:px-6 lg:px-8">
                {application ? (
                    <div className="rounded-xl border border-slate-200 bg-white p-5">
                        <p className="text-sm text-slate-500">
                            Статус: {application.status_label}
                        </p>
                        <h3 className="mt-2 text-lg font-medium">{application.headline}</h3>
                        <p className="mt-3 whitespace-pre-wrap text-sm text-slate-600">
                            {application.bio}
                        </p>
                        <div className="mt-3 flex flex-wrap gap-1">
                            {application.skills.map((skill) => (
                                <span
                                    key={skill}
                                    className="rounded bg-slate-100 px-2 py-0.5 text-xs"
                                >
                                    {skill}
                                </span>
                            ))}
                        </div>
                        {application.resume_url && (
                            <p className="mt-3 text-sm">
                                <a
                                    href={application.resume_url}
                                    target="_blank"
                                    rel="noreferrer"
                                    className="underline"
                                >
                                    Резюме (ссылка)
                                </a>
                            </p>
                        )}
                        {application.resume_file_url && (
                            <p className="mt-2 text-sm">
                                <a href={application.resume_file_url} className="underline">
                                    {application.resume_file_name ?? 'Скачать резюме'}
                                </a>
                            </p>
                        )}
                        {application.admin_note && (
                            <p className="mt-3 text-sm text-rose-600">{application.admin_note}</p>
                        )}
                        {application.status === 'approved' && (
                            <p className="mt-3 text-sm text-emerald-700">
                                Анкета одобрена — доступна лента заказов.
                            </p>
                        )}
                        <Link
                            href={route('profile.edit')}
                            className="mt-4 inline-block text-sm underline"
                        >
                            Редактировать в профиле
                        </Link>
                    </div>
                ) : (
                    <div className="rounded-xl border border-slate-200 bg-white p-5 text-sm text-slate-600">
                        Анкеты ещё нет.{' '}
                        <Link href={route('register')} className="underline">
                            Зарегистрируйтесь как программист
                        </Link>{' '}
                        или заполните данные в{' '}
                        <Link href={route('profile.edit')} className="underline">
                            профиле
                        </Link>
                        .
                    </div>
                )}
            </div>
        </CabinetLayout>
    );
}
