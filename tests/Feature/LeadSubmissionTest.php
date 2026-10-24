<?php

namespace Tests\Feature;

use App\Models\Lead;
use App\Notifications\NewLeadNotification;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\Notification;
use Tests\TestCase;

class LeadSubmissionTest extends TestCase
{
    use RefreshDatabase;

    public function test_homepage_returns_successful_response(): void
    {
        $response = $this->get('/');

        $response->assertOk();
        $response->assertInertia(fn ($page) => $page
            ->component('Home')
            ->has('about_images', 4)
            ->has('hero_image'));
    }

    public function test_lead_can_be_submitted(): void
    {
        Notification::fake();

        config(['mail.lead_notification_email' => 'admin@example.com']);

        $response = $this->post(route('leads.store'), [
            'name' => 'Иван Тестов',
            'email' => 'ivan@example.com',
            'phone' => '+79990001122',
            'message' => 'Нужен лендинг для студии.',
            'company' => '',
        ]);

        $response->assertRedirect(route('home').'#contact');
        $response->assertSessionHas('lead_status', 'sent');

        $this->assertDatabaseHas('leads', [
            'email' => 'ivan@example.com',
            'status' => 'new',
        ]);

        Notification::assertSentOnDemand(NewLeadNotification::class);
    }

    public function test_lead_requires_valid_fields(): void
    {
        $response = $this->from('/')->post(route('leads.store'), [
            'name' => '',
            'email' => 'not-an-email',
            'message' => '',
        ]);

        $response->assertRedirect('/');
        $response->assertSessionHasErrors(['name', 'email', 'message']);
        $this->assertSame(0, Lead::query()->count());
    }

    public function test_honeypot_rejects_bots(): void
    {
        $response = $this->from('/')->post(route('leads.store'), [
            'name' => 'Bot',
            'email' => 'bot@example.com',
            'message' => 'Spam message content here',
            'company' => 'Acme Corp',
        ]);

        $response->assertRedirect('/');
        $response->assertSessionHasErrors('company');
        $this->assertSame(0, Lead::query()->count());
    }

    public function test_lead_supports_soft_delete(): void
    {
        $lead = Lead::query()->create([
            'name' => 'Soft',
            'email' => 'soft@example.com',
            'message' => 'test',
            'status' => 'new',
        ]);

        $lead->delete();

        $this->assertSoftDeleted($lead);
        $this->assertSame(0, Lead::query()->count());
        $this->assertSame(1, Lead::withTrashed()->count());
    }
}
