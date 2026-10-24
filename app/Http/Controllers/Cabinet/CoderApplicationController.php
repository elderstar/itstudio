<?php

namespace App\Http\Controllers\Cabinet;

use App\Enums\CoderApplicationStatus;
use App\Http\Controllers\Controller;
use App\Models\CoderApplication;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class CoderApplicationController extends Controller
{
    public function show(Request $request): Response
    {
        $application = $request->user()->coderApplication;

        return Inertia::render('Cabinet/CoderApplication/Show', [
            'application' => $application ? [
                'id' => $application->id,
                'headline' => $application->headline,
                'bio' => $application->bio,
                'skills' => $application->skills ?? [],
                'experience_level' => $application->experience_level ?? 0,
                'resume_url' => $application->resume_url,
                'resume_file_name' => $application->resumeFileName(),
                'resume_file_url' => $application->resumeFileUrl(),
                'status' => $application->status->value,
                'status_label' => $application->status->label(),
                'admin_note' => $application->status === CoderApplicationStatus::Rejected
                    ? $application->admin_note
                    : null,
            ] : null,
            'can_create' => false,
        ]);
    }

    public function store(Request $request)
    {
        return redirect()->route('profile.edit');
    }
}
