<?php

namespace App\Services;

use App\Enums\CoderApplicationStatus;
use App\Models\CoderApplication;
use App\Models\User;
use App\Notifications\CoderApplicationReviewed;

class CoderApplicationService
{
    public function approve(CoderApplication $application, User $admin): void
    {
        $application->update([
            'status' => CoderApplicationStatus::Approved,
            'reviewed_at' => now(),
            'reviewed_by' => $admin->id,
        ]);

        $user = $application->user;
        if (! $user->hasRole('coder')) {
            $user->assignRole('coder');
        }

        activity()
            ->causedBy($admin)
            ->performedOn($application)
            ->log('coder_application_approved');

        $user->notify(new CoderApplicationReviewed($application->fresh()));
    }

    public function reject(CoderApplication $application, User $admin, ?string $note = null): void
    {
        $application->update([
            'status' => CoderApplicationStatus::Rejected,
            'admin_note' => $note,
            'reviewed_at' => now(),
            'reviewed_by' => $admin->id,
        ]);

        activity()
            ->causedBy($admin)
            ->performedOn($application)
            ->log('coder_application_rejected');

        $application->user->notify(new CoderApplicationReviewed($application->fresh()));
    }
}
