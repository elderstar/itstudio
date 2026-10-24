<?php

namespace App\Http\Controllers;

use App\Enums\CoderApplicationStatus;
use App\Http\Requests\ProfileUpdateRequest;
use App\Models\CoderApplication;
use App\Support\CoderProfile;
use Illuminate\Contracts\Auth\MustVerifyEmail;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Redirect;
use Inertia\Inertia;
use Inertia\Response;

class ProfileController extends Controller
{
    public function edit(Request $request): Response
    {
        $user = $request->user();
        $application = $user->coderApplication;

        return Inertia::render('Profile/Edit', [
            'mustVerifyEmail' => $user instanceof MustVerifyEmail,
            'status' => session('status'),
            'skillOptions' => CoderProfile::skillOptions(),
            'experienceLabels' => CoderProfile::experienceLabels(),
            'coderProfile' => $application ? [
                'bio' => $application->bio,
                'skills' => $application->skills ?? [],
                'experience_level' => $application->experience_level ?? 0,
                'resume_url' => $application->resume_url,
                'resume_file_name' => $application->resumeFileName(),
                'resume_file_url' => $application->resumeFileUrl(),
                'status' => $application->status->value,
                'status_label' => $application->status->label(),
            ] : null,
        ]);
    }

    public function update(ProfileUpdateRequest $request): RedirectResponse
    {
        $user = $request->user();
        $validated = $request->validated();

        $user->fill([
            'name' => $validated['name'],
            'email' => $validated['email'],
        ]);

        if ($user->isDirty('email')) {
            $user->email_verified_at = null;
        }

        $user->save();

        if (array_key_exists('bio', $validated)) {
            $application = $user->coderApplication;

            if (! $application) {
                $application = CoderApplication::query()->create([
                    'user_id' => $user->id,
                    'headline' => $user->name,
                    'status' => CoderApplicationStatus::Pending,
                    'nda_accepted' => false,
                ]);
                if (! $user->hasRole('coder')) {
                    $user->assignRole('coder');
                }
            }

            $application->fill([
                'headline' => $user->name,
                'bio' => $validated['bio'],
                'skills' => array_values($validated['skills']),
                'experience_level' => (int) $validated['experience_level'],
                'resume_url' => $validated['resume_url'] ?? null,
            ]);
            $application->save();

            if ($request->boolean('clear_resume_file')) {
                $application->clearMediaCollection('resume');
            }

            if ($request->hasFile('resume')) {
                $application->addMediaFromRequest('resume')->toMediaCollection('resume');
            }
        }

        return Redirect::route('profile.edit');
    }

    public function updateAvatar(Request $request): RedirectResponse
    {
        $request->validate([
            'avatar' => ['required', 'image', 'max:4096'],
        ]);

        $user = $request->user();
        $user->addMediaFromRequest('avatar')->toMediaCollection('avatar');

        return Redirect::route('profile.edit')->with('status', 'avatar-updated');
    }

    public function destroy(Request $request): RedirectResponse
    {
        $request->validate([
            'password' => ['required', 'current_password'],
        ]);

        $user = $request->user();

        Auth::logout();

        $user->delete();

        $request->session()->invalidate();
        $request->session()->regenerateToken();

        return Redirect::to('/');
    }
}
