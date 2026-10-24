<?php

use App\Models\Order;
use Illuminate\Support\Facades\Broadcast;

Broadcast::channel('App.Models.User.{id}', function ($user, $id) {
    return (int) $user->id === (int) $id;
});

Broadcast::channel('orders.{orderId}', function ($user, int $orderId) {
    $order = Order::query()->find($orderId);

    return $order && $user->isActiveParticipantOf($order);
});
