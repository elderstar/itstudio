<?php

namespace App\Http\Controllers;

use App\Http\Requests\StoreLeadRequest;
use App\Models\Lead;
use App\Notifications\NewLeadNotification;
use Illuminate\Http\RedirectResponse;
use Illuminate\Support\Facades\Notification;
use Illuminate\Support\Facades\RateLimiter;
use Illuminate\Validation\ValidationException;

class LeadController extends Controller
{
    public function store(StoreLeadRequest $request): RedirectResponse
    {
        $rate_key = 'lead-submit:'.$request->ip();

        if (RateLimiter::tooManyAttempts($rate_key, 5)) {
            throw ValidationException::withMessages([
                'email' => 'Слишком много заявок. Попробуйте позже.',
            ]);
        }

        RateLimiter::hit($rate_key, 60);

        $lead = Lead::query()->create([
            ...$request->safe()->only(['name', 'email', 'phone', 'message']),
            'status' => 'new',
            'ip_address' => $request->ip(),
        ]);

        $notification_email = config('mail.lead_notification_email');

        if (is_string($notification_email) && $notification_email !== '') {
            Notification::route('mail', $notification_email)
                ->notify(new NewLeadNotification($lead));
        }

        return redirect()
            ->route('home')
            ->with('lead_status', 'sent')
            ->withFragment('contact');
    }
}
