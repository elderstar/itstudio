<?php

namespace App\Http\Controllers\Auth;

use App\Enums\CoderApplicationStatus;
use App\Http\Controllers\Controller;
use App\Models\CoderApplication;
use App\Models\User;
use App\Support\CoderProfile;
use Illuminate\Auth\Events\Registered;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;
use Illuminate\Validation\Rule;
use Illuminate\Validation\Rules;
use Illuminate\Validation\ValidationException;
use Inertia\Inertia;
use Inertia\Response;

class RegisteredUserController extends Controller
{
    public function create(): Response
    {
        return Inertia::render('Auth/Register', [
            'skillOptions' => CoderProfile::skillOptions(),
            'experienceLabels' => CoderProfile::experienceLabels(),
        ]);
    }

    /**
     * @throws ValidationException
     */
    public function store(Request $request): RedirectResponse
    {
        $data = $request->validate([
            'name' => ['required', 'string', 'max:255'],
            'email' => ['required', 'string', 'lowercase', 'email', 'max:255', 'unique:'.User::class],
            'password' => ['required', 'confirmed', Rules\Password::defaults()],
            'bio' => ['required', 'string', 'max:2000'],
            'skills' => ['required', 'array', 'min:1'],
            'skills.*' => ['string', Rule::in(CoderProfile::skillOptions())],
            'experience_level' => ['required', 'integer', 'min:0', 'max:100'],
            'resume_url' => ['nullable', 'url', 'max:500'],
            'resume' => CoderProfile::resumeRules(),
            'nda_accepted' => ['accepted'],
        ]);

        $user = DB::transaction(function () use ($request, $data) {
            $user = User::create([
                'name' => $data['name'],
                'email' => $data['email'],
                'password' => Hash::make($data['password']),
            ]);

            $user->assignRole('coder');

            $application = CoderApplication::query()->create([
                'user_id' => $user->id,
                'headline' => $data['name'],
                'bio' => $data['bio'],
                'skills' => array_values($data['skills']),
                'experience_level' => (int) $data['experience_level'],
                'resume_url' => $data['resume_url'] ?? null,
                'status' => CoderApplicationStatus::Pending,
                'nda_accepted' => true,
                'nda_accepted_at' => now(),
            ]);

            if ($request->hasFile('resume')) {
                $application->addMediaFromRequest('resume')->toMediaCollection('resume');
            }

            return $user;
        });

        event(new Registered($user));

        Auth::login($user);

        return redirect()->route('cabinet.coder-application.show');
    }
}
