<?php

namespace App\Http\Controllers\Cabinet;

use App\Http\Controllers\Controller;
use App\Models\Order;
use App\Models\OrderParticipant;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class OrderController extends Controller
{
    public function index(Request $request): Response
    {
        $user = $request->user();

        $orders = Order::query()
            ->with(['tags:id,name,slug', 'client:id,name'])
            ->when(
                $user->hasRole('admin'),
                fn ($q) => $q,
                fn ($q) => $q->where(function ($inner) use ($user) {
                    $inner->where('client_id', $user->id)
                        ->orWhereHas('participants', function ($p) use ($user) {
                            $p->where('user_id', $user->id)
                                ->whereNotNull('joined_at')
                                ->whereNull('left_at');
                        });
                }),
            )
            ->latest()
            ->paginate(20)
            ->through(function (Order $order) use ($user) {
                $unread = 0;
                $participant = OrderParticipant::query()
                    ->where('order_id', $order->id)
                    ->where('user_id', $user->id)
                    ->first();

                if ($participant?->last_read_at) {
                    $unread = $order->messages()
                        ->where('created_at', '>', $participant->last_read_at)
                        ->where('user_id', '!=', $user->id)
                        ->count();
                } elseif ($participant) {
                    $unread = $order->messages()->where('user_id', '!=', $user->id)->count();
                }

                return [
                    'id' => $order->id,
                    'title' => $order->title,
                    'category' => $order->category,
                    'status' => $order->status->value,
                    'status_label' => $order->status->label(),
                    'recruiting_open' => $order->recruiting_open,
                    'tags' => $order->tags,
                    'client' => $order->client,
                    'unread_count' => $unread,
                    'updated_at' => $order->updated_at?->toIso8601String(),
                ];
            });

        return Inertia::render('Cabinet/Orders/Index', [
            'orders' => $orders,
        ]);
    }

    public function show(Request $request, Order $order): Response
    {
        $this->authorize('view', $order);

        $order->load([
            'tags:id,name,slug',
            'client:id,name,email',
            'activeParticipants.user:id,name,email',
            'stages',
            'stageEdges',
        ]);

        $user = $request->user();
        $hideBudget = $order->hide_budget_from_coders
            && $user->hasRole('coder')
            && ! $user->hasRole('admin')
            && (int) $order->client_id !== (int) $user->id;

        return Inertia::render('Cabinet/Orders/Show', [
            'order' => [
                'id' => $order->id,
                'title' => $order->title,
                'category' => $order->category,
                'description' => $order->description,
                'brief' => $order->brief,
                'status' => $order->status->value,
                'status_label' => $order->status->label(),
                'recruiting_open' => $order->recruiting_open,
                'budget' => $hideBudget ? null : $order->budget,
                'stages_approved_at' => $order->stages_approved_at?->toIso8601String(),
                'tags' => $order->tags,
                'client' => $order->client,
                'participants' => $order->activeParticipants->map(fn ($p) => [
                    'id' => $p->id,
                    'role' => $p->role,
                    'joined_at' => $p->joined_at?->toIso8601String(),
                    'user' => [
                        'id' => $p->user->id,
                        'name' => $p->user->name,
                        'email' => $p->user->email,
                        'avatar_url' => $p->user->avatar_url,
                    ],
                ]),
                'stages' => $order->stages->map(fn ($s) => [
                    'id' => $s->id,
                    'title' => $s->title,
                    'description' => $s->description,
                    'status' => $s->status->value,
                    'position' => $s->position,
                    'position_x' => $s->position_x,
                    'position_y' => $s->position_y,
                ]),
                'edges' => $order->stageEdges->map(fn ($e) => [
                    'id' => $e->id,
                    'source' => (string) $e->source_stage_id,
                    'target' => (string) $e->target_stage_id,
                ]),
            ],
            'can_approve_stages' => $user->can('approveStages', $order),
        ]);
    }

    public function approveStages(Request $request, Order $order)
    {
        $this->authorize('approveStages', $order);

        $order->update(['stages_approved_at' => now()]);

        return back()->with('status', 'stages-approved');
    }
}
