<?php

namespace App\Services;

use App\Enums\JoinRequestStatus;
use App\Enums\OrderStatus;
use App\Models\Lead;
use App\Models\Order;
use App\Models\OrderJoinRequest;
use App\Models\OrderParticipant;
use App\Models\User;
use App\Notifications\JoinRequestReviewed;
use Illuminate\Support\Facades\DB;

class OrderService
{
    public function createFromLead(Lead $lead, array $data, User $admin): Order
    {
        return DB::transaction(function () use ($lead, $data, $admin) {
            $clientCreated = false;
            $client = User::query()->firstOrCreate(
                ['email' => $lead->email],
                [
                    'name' => $lead->name,
                    'password' => bcrypt(str()->random(32)),
                    'email_verified_at' => now(),
                ],
            );
            $clientCreated = $client->wasRecentlyCreated;

            if (! $client->hasRole('client')) {
                $client->assignRole('client');
            }

            if ($clientCreated) {
                \Illuminate\Support\Facades\Password::sendResetLink(['email' => $client->email]);
            }

            $order = Order::query()->create([
                'client_id' => $client->id,
                'lead_id' => $lead->id,
                'title' => $data['title'] ?? 'Заказ от '.$lead->name,
                'category' => $data['category'] ?? null,
                'description' => $data['description'] ?? $lead->message,
                'brief' => $data['brief'] ?? $lead->message,
                'status' => OrderStatus::Recruiting,
                'recruiting_open' => true,
                'hide_budget_from_coders' => $data['hide_budget_from_coders'] ?? true,
                'budget' => $data['budget'] ?? null,
            ]);

            if (! empty($data['tag_ids'])) {
                $order->tags()->sync($data['tag_ids']);
            }

            OrderParticipant::query()->create([
                'order_id' => $order->id,
                'user_id' => $client->id,
                'role' => 'client',
                'joined_at' => now(),
            ]);

            $lead->update(['status' => 'converted']);

            activity()
                ->causedBy($admin)
                ->performedOn($order)
                ->log('order_created_from_lead');

            return $order;
        });
    }

    public function approveJoinRequest(OrderJoinRequest $joinRequest, User $admin): OrderParticipant
    {
        return DB::transaction(function () use ($joinRequest, $admin) {
            $joinRequest->update([
                'status' => JoinRequestStatus::Approved,
                'reviewed_at' => now(),
                'reviewed_by' => $admin->id,
            ]);

            $participant = OrderParticipant::query()->updateOrCreate(
                [
                    'order_id' => $joinRequest->order_id,
                    'user_id' => $joinRequest->user_id,
                ],
                [
                    'role' => 'coder',
                    'joined_at' => now(),
                    'left_at' => null,
                ],
            );

            activity()
                ->causedBy($admin)
                ->performedOn($joinRequest->order)
                ->withProperties(['user_id' => $joinRequest->user_id])
                ->log('participant_joined');

            $joinRequest->user->notify(new JoinRequestReviewed($joinRequest->fresh('order')));

            return $participant;
        });
    }

    public function rejectJoinRequest(OrderJoinRequest $joinRequest, User $admin, ?string $note = null): void
    {
        $joinRequest->update([
            'status' => JoinRequestStatus::Rejected,
            'admin_note' => $note,
            'reviewed_at' => now(),
            'reviewed_by' => $admin->id,
        ]);

        $joinRequest->user->notify(new JoinRequestReviewed($joinRequest->fresh('order')));
    }

    public function kickParticipant(Order $order, User $participantUser, User $admin): void
    {
        OrderParticipant::query()
            ->where('order_id', $order->id)
            ->where('user_id', $participantUser->id)
            ->whereNull('left_at')
            ->update(['left_at' => now()]);

        activity()
            ->causedBy($admin)
            ->performedOn($order)
            ->withProperties(['user_id' => $participantUser->id])
            ->log('participant_kicked');
    }
}
