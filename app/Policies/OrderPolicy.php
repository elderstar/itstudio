<?php

namespace App\Policies;

use App\Models\Order;
use App\Models\User;

class OrderPolicy
{
    public function viewAny(User $user): bool
    {
        return $user->hasAnyRole(['client', 'coder', 'admin']);
    }

    public function view(User $user, Order $order): bool
    {
        return $user->isActiveParticipantOf($order);
    }

    public function viewFeed(User $user): bool
    {
        return $user->isApprovedCoder() || $user->hasRole('admin');
    }

    public function create(User $user): bool
    {
        return $user->hasRole('admin');
    }

    public function update(User $user, Order $order): bool
    {
        return $user->hasRole('admin');
    }

    public function approveStages(User $user, Order $order): bool
    {
        return (int) $order->client_id === (int) $user->id || $user->hasRole('admin');
    }

    public function chat(User $user, Order $order): bool
    {
        return $user->isActiveParticipantOf($order);
    }

    public function uploadFiles(User $user, Order $order): bool
    {
        return $user->isActiveParticipantOf($order);
    }

    public function join(User $user, Order $order): bool
    {
        if (! $user->isApprovedCoder()) {
            return false;
        }

        if (! $order->recruiting_open) {
            return false;
        }

        if ($user->isActiveParticipantOf($order)) {
            return false;
        }

        return ! $order->joinRequests()
            ->where('user_id', $user->id)
            ->where('status', 'pending')
            ->exists();
    }
}
