<?php

namespace App\Http\Middleware;

use Illuminate\Http\Request;
use Inertia\Middleware;

class HandleInertiaRequests extends Middleware
{
    protected $rootView = 'app';

    public function version(Request $request): ?string
    {
        return parent::version($request);
    }

    /**
     * @return array<string, mixed>
     */
    public function share(Request $request): array
    {
        $user = $request->user();

        return [
            ...parent::share($request),
            'auth' => [
                'user' => $user ? [
                    'id' => $user->id,
                    'name' => $user->name,
                    'email' => $user->email,
                    'email_verified_at' => $user->email_verified_at,
                    'avatar_url' => $user->avatar_url,
                    'roles' => $user->getRoleNames()->values()->all(),
                    'is_approved_coder' => $user->isApprovedCoder(),
                    'unread_notifications' => $user->unreadNotifications()->count(),
                ] : null,
            ],
            'flash' => [
                'lead_status' => fn () => $request->session()->get('lead_status'),
                'status' => fn () => $request->session()->get('status'),
            ],
        ];
    }
}
