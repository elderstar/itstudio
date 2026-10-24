<?php

namespace App\Http\Controllers\Cabinet;

use App\Enums\JoinRequestStatus;
use App\Http\Controllers\Controller;
use App\Models\Order;
use App\Models\OrderJoinRequest;
use Illuminate\Http\Request;

class OrderJoinRequestController extends Controller
{
    public function store(Request $request, Order $order)
    {
        $this->authorize('join', $order);

        $data = $request->validate([
            'message' => ['nullable', 'string', 'max:2000'],
        ]);

        OrderJoinRequest::query()->updateOrCreate(
            [
                'order_id' => $order->id,
                'user_id' => $request->user()->id,
            ],
            [
                'message' => $data['message'] ?? null,
                'status' => JoinRequestStatus::Pending,
                'reviewed_at' => null,
                'reviewed_by' => null,
                'admin_note' => null,
            ],
        );

        return back()->with('status', 'join-requested');
    }
}
