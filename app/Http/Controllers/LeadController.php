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

        $safe = $request->safe();

        $lead = Lead::query()->create([
            'name' => $safe['name'],
            'email' => $safe['email'] ?? null,
            'phone' => $safe['phone'] ?? null,
            'message' => $safe['message'],
            'intent' => $safe['intent'],
            'intake' => [
                'step2_chips' => $safe['step2_chips'] ?? [],
                'step2_note' => $safe['step2_note'] ?? null,
                'step3_chips' => $safe['step3_chips'] ?? [],
                'step3_note' => $safe['step3_note'] ?? null,
                'skipped_step3' => (bool) ($safe['skipped_step3'] ?? false),
            ],
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
