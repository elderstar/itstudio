import PrimaryButton from '@/Components/PrimaryButton';
import { useForm, usePage } from '@inertiajs/react';
import { FormEventHandler } from 'react';

export default function UpdateAvatarForm({ className = '' }: { className?: string }) {
    const user = usePage().props.auth.user!;
    const form = useForm<{ avatar: File | null }>({ avatar: null });

    const submit: FormEventHandler = (e) => {
        e.preventDefault();
        form.post(route('profile.avatar'), { forceFormData: true });
    };

    return (
        <section className={className}>
            <header>
                <h2 className="text-lg font-medium text-gray-900">Аватар</h2>
                <p className="mt-1 text-sm text-gray-600">
                    Используется в чатах заказов.
                </p>
            </header>

            <form onSubmit={submit} className="mt-6 space-y-4">
                {user.avatar_url && (
                    <img
                        src={user.avatar_url}
                        alt=""
                        className="h-16 w-16 rounded-full object-cover"
                    />
                )}
                <input
                    type="file"
                    accept="image/*"
                    required
                    onChange={(e) => form.setData('avatar', e.target.files?.[0] ?? null)}
                />
                <PrimaryButton disabled={form.processing}>Загрузить</PrimaryButton>
            </form>
        </section>
    );
}
