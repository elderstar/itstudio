<?php

namespace App\Http\Controllers\Cabinet;

use App\Http\Controllers\Controller;
use App\Models\Order;
use App\Models\SpecialistTag;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class CoderFeedController extends Controller
{
    public function index(Request $request): Response
    {
        $this->authorize('viewFeed', Order::class);

        $filters = $request->validate([
            'category' => ['nullable', 'string', 'max:100'],
            'tag' => ['nullable', 'string', 'max:100'],
            'recruiting' => ['nullable', 'boolean'],
        ]);

        $orders = Order::query()
            ->with(['tags:id,name,slug'])
            ->whereIn('status', ['recruiting', 'active'])
            ->when(
                array_key_exists('recruiting', $filters) && $filters['recruiting'] !== null,
                fn ($q) => $q->where('recruiting_open', (bool) $filters['recruiting']),
                fn ($q) => $q->where('recruiting_open', true),
            )
            ->when($filters['category'] ?? null, fn ($q, $category) => $q->where('category', $category))
            ->when($filters['tag'] ?? null, function ($q) use ($filters) {
                $q->whereHas('tags', fn ($t) => $t->where('slug', $filters['tag']));
            })
            ->latest()
            ->paginate(15)
            ->withQueryString()
            ->through(function (Order $order) use ($request) {
                $hideBudget = $order->hide_budget_from_coders;

                return [
                    'id' => $order->id,
                    'title' => $order->title,
                    'category' => $order->category,
                    'description' => str($order->description)->limit(280)->toString(),
                    'status' => $order->status->value,
                    'status_label' => $order->status->label(),
                    'recruiting_open' => $order->recruiting_open,
                    'budget' => $hideBudget ? null : $order->budget,
                    'tags' => $order->tags,
                    'can_join' => $request->user()->can('join', $order),
                ];
            });

        return Inertia::render('Cabinet/Feed/Index', [
            'orders' => $orders,
            'filters' => [
                'category' => $filters['category'] ?? null,
                'tag' => $filters['tag'] ?? null,
                'recruiting' => $filters['recruiting'] ?? true,
            ],
            'tags' => SpecialistTag::query()->orderBy('name')->get(['id', 'name', 'slug']),
            'categories' => Order::query()
                ->whereNotNull('category')
                ->distinct()
                ->orderBy('category')
                ->pluck('category'),
        ]);
    }

    public function show(Request $request, Order $order): Response
    {
        $this->authorize('viewFeed', Order::class);
        abort_unless($order->recruiting_open || $request->user()->isActiveParticipantOf($order), 403);

        $order->load('tags:id,name,slug');

        return Inertia::render('Cabinet/Feed/Show', [
            'order' => [
                'id' => $order->id,
                'title' => $order->title,
                'category' => $order->category,
                'description' => $order->description,
                'status' => $order->status->value,
                'status_label' => $order->status->label(),
                'recruiting_open' => $order->recruiting_open,
                'budget' => $order->hide_budget_from_coders ? null : $order->budget,
                'tags' => $order->tags,
                'can_join' => $request->user()->can('join', $order),
            ],
        ]);
    }
}
