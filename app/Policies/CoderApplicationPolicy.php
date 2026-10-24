<?php

namespace App\Policies;

use App\Models\CoderApplication;
use App\Models\User;

class CoderApplicationPolicy
{
    public function viewOwn(User $user): bool
    {
        return $user->hasAnyRole(['coder', 'client']) || ! $user->roles()->exists();
    }

    public function create(User $user): bool
    {
        if ($user->hasRole('admin')) {
            return false;
        }

        return ! $user->coderApplication()
            ->whereIn('status', ['pending', 'approved'])
            ->exists();
    }

    public function update(User $user, CoderApplication $application): bool
    {
        return (int) $application->user_id === (int) $user->id
            && $application->status->value === 'pending';
    }
}
