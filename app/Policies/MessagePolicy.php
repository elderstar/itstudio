<?php

namespace App\Policies;

use App\Models\Message;
use App\Models\Order;
use App\Models\User;

class MessagePolicy
{
    public function viewAny(User $user, Order $order): bool
    {
        return $user->isActiveParticipantOf($order);
    }

    public function create(User $user, Order $order): bool
    {
        return $user->isActiveParticipantOf($order);
    }

    public function delete(User $user, Message $message): bool
    {
        return $user->hasRole('admin') || (int) $message->user_id === (int) $user->id;
    }
}
