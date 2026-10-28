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
            'message' => "Намерение: Есть конкретная проблема\nШаг 2 (чипы): Мало заявок",
            'company' => '',
            'intent' => 'has_problem',
            'step2_chips' => ['Мало заявок'],
            'step2_note' => '',
            'step3_chips' => ['Интернет-магазин'],
            'step3_note' => '',
            'skipped_step3' => false,
        ]);

        $response->assertRedirect(route('home').'#contact');
        $response->assertSessionHas('lead_status', 'sent');

        $this->assertDatabaseHas('leads', [
            'email' => 'ivan@example.com',
            'status' => 'new',
            'intent' => 'has_problem',
        ]);

        Notification::assertSentOnDemand(NewLeadNotification::class);
    }

    public function test_lead_accepts_phone_without_email(): void
    {
        $response = $this->post(route('leads.store'), [
            'name' => 'Мария',
            'email' => '',
            'phone' => '+79991112233',
            'message' => 'Намерение: Хочу понять, что улучшить',
            'company' => '',
            'intent' => 'want_improve',
            'step2_chips' => ['Сервис / SaaS'],
            'skipped_step3' => true,
        ]);

        $response->assertRedirect(route('home').'#contact');
        $this->assertDatabaseHas('leads', [
            'name' => 'Мария',
            'phone' => '+79991112233',
            'intent' => 'want_improve',
        ]);
    }

    public function test_lead_requires_valid_fields(): void
    {
        $response = $this->from('/')->post(route('leads.store'), [
            'name' => '',
            'email' => 'not-an-email',
            'message' => '',
        ]);

        $response->assertRedirect('/');
        $response->assertSessionHasErrors(['name', 'email', 'message', 'intent']);
        $this->assertSame(0, Lead::query()->count());
    }

    public function test_lead_accepts_dev_task_intent(): void
    {
        Notification::fake();
        config(['mail.lead_notification_email' => 'admin@example.com']);

        $response = $this->post(route('leads.store'), [
            'name' => 'Алексей',
            'email' => 'alex@example.com',
            'phone' => '',
            'message' => "Намерение: Есть задача на разработку\nШаг 2 (чипы): Сайт с нуля",
            'company' => '',
            'intent' => 'need_dev',
            'step2_chips' => ['Сайт с нуля'],
            'step2_note' => '',
            'step3_chips' => ['1–3 месяца'],
            'step3_note' => '',
            'skipped_step3' => false,
        ]);

        $response->assertRedirect(route('home').'#contact');
        $this->assertDatabaseHas('leads', [
            'email' => 'alex@example.com',
            'intent' => 'need_dev',
        ]);
        Notification::assertSentOnDemand(NewLeadNotification::class);
    }

    public function test_honeypot_rejects_bots(): void
    {
        $response = $this->from('/')->post(route('leads.store'), [
            'name' => 'Bot',
            'email' => 'bot@example.com',
            'message' => 'Spam message content here',
            'company' => 'Acme Corp',
            'intent' => 'just_chat',
            'step2_chips' => ['Основатель'],
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
