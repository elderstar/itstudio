<?php

namespace Tests\Feature;

use App\Enums\CoderApplicationStatus;
use App\Enums\OrderStatus;
use App\Models\CoderApplication;
use App\Models\Order;
use App\Models\OrderParticipant;
use App\Models\User;
use Database\Seeders\RoleSeeder;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class OrderCabinetTest extends TestCase
{
    use RefreshDatabase;

    protected function setUp(): void
    {
        parent::setUp();
        $this->seed(RoleSeeder::class);
    }

    public function test_client_cannot_view_another_clients_order(): void
    {
        $clientA = User::factory()->create();
        $clientA->assignRole('client');
        $clientB = User::factory()->create();
        $clientB->assignRole('client');

        $order = Order::query()->create([
            'client_id' => $clientA->id,
            'title' => 'Secret',
            'status' => OrderStatus::Active,
        ]);
        OrderParticipant::query()->create([
            'order_id' => $order->id,
            'user_id' => $clientA->id,
            'role' => 'client',
            'joined_at' => now(),
        ]);

        $this->actingAs($clientB)
            ->get(route('cabinet.orders.show', $order))
            ->assertForbidden();
    }

    public function test_coder_without_approve_cannot_see_feed(): void
    {
        $coder = User::factory()->create();
        $coder->assignRole('coder');

        $this->actingAs($coder)
            ->get(route('cabinet.feed.index'))
            ->assertForbidden();
    }

    public function test_approved_coder_can_see_feed(): void
    {
        $coder = User::factory()->create();
        $coder->assignRole('coder');
        CoderApplication::query()->create([
            'user_id' => $coder->id,
            'headline' => 'Dev',
            'bio' => 'Bio',
            'status' => CoderApplicationStatus::Approved,
            'nda_accepted' => true,
            'nda_accepted_at' => now(),
        ]);

        $this->actingAs($coder)
            ->get(route('cabinet.feed.index'))
            ->assertOk();
    }

    public function test_left_participant_cannot_access_chat(): void
    {
        $client = User::factory()->create();
        $client->assignRole('client');
        $coder = User::factory()->create();
        $coder->assignRole('coder');

        $order = Order::query()->create([
            'client_id' => $client->id,
            'title' => 'Project',
            'status' => OrderStatus::Active,
        ]);
        OrderParticipant::query()->create([
            'order_id' => $order->id,
            'user_id' => $coder->id,
            'role' => 'coder',
            'joined_at' => now()->subDay(),
            'left_at' => now(),
        ]);

        $this->actingAs($coder)
            ->get(route('cabinet.orders.chat', $order))
            ->assertForbidden();
    }
}
