import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { PageProps } from '@/types';
import { Head } from '@inertiajs/react';
import DeleteUserForm from './Partials/DeleteUserForm';
import UpdateAvatarForm from './Partials/UpdateAvatarForm';
import UpdatePasswordForm from './Partials/UpdatePasswordForm';
import UpdateProfileInformationForm from './Partials/UpdateProfileInformationForm';

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

export default function Edit({
    mustVerifyEmail,
    status,
    coderProfile,
    skillOptions,
    experienceLabels,
}: PageProps<{
    mustVerifyEmail: boolean;
    status?: string;
    coderProfile: CoderProfile | null;
    skillOptions: string[];
    experienceLabels: Record<number, string>;
}>) {
    return (
        <AuthenticatedLayout
            header={
                <h2 className="text-xl font-semibold leading-tight text-gray-800">
                    Профиль
                </h2>
            }
        >
            <Head title="Профиль" />

            <div className="py-12">
                <div className="mx-auto max-w-7xl space-y-6 sm:px-6 lg:px-8">
                    <div className="bg-white p-4 shadow sm:rounded-lg sm:p-8">
                        <UpdateProfileInformationForm
                            mustVerifyEmail={mustVerifyEmail}
                            status={status}
                            coderProfile={coderProfile}
                            skillOptions={skillOptions}
                            experienceLabels={experienceLabels}
                            className="max-w-xl"
                        />
                    </div>

                    <div className="bg-white p-4 shadow sm:rounded-lg sm:p-8">
                        <UpdateAvatarForm className="max-w-xl" />
                    </div>

                    <div className="bg-white p-4 shadow sm:rounded-lg sm:p-8">
                        <UpdatePasswordForm className="max-w-xl" />
                    </div>

                    <div className="bg-white p-4 shadow sm:rounded-lg sm:p-8">
                        <DeleteUserForm className="max-w-xl" />
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
