<?php

namespace App\Http\Controllers\Cabinet;

use App\Http\Controllers\Controller;
use App\Models\Order;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class OrderStageController extends Controller
{
    public function index(Request $request, Order $order): Response
    {
        $this->authorize('view', $order);

        $order->load(['stages', 'stageEdges']);

        return Inertia::render('Cabinet/Orders/Stages', [
            'order' => [
                'id' => $order->id,
                'title' => $order->title,
                'stages_approved_at' => $order->stages_approved_at?->toIso8601String(),
            ],
            'stages' => $order->stages->map(fn ($s) => [
                'id' => (string) $s->id,
                'title' => $s->title,
                'description' => $s->description,
                'status' => $s->status->value,
                'position' => ['x' => $s->position_x, 'y' => $s->position_y],
            ]),
            'edges' => $order->stageEdges->map(fn ($e) => [
                'id' => (string) $e->id,
                'source' => (string) $e->source_stage_id,
                'target' => (string) $e->target_stage_id,
            ]),
            'can_approve_stages' => $request->user()->can('approveStages', $order),
        ]);
    }
}
