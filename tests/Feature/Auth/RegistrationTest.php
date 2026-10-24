<?php

namespace Tests\Feature\Auth;

use App\Models\CoderApplication;
use App\Models\User;
use Database\Seeders\RoleSeeder;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class RegistrationTest extends TestCase
{
    use RefreshDatabase;

    protected function setUp(): void
    {
        parent::setUp();
        $this->seed(RoleSeeder::class);
    }

    public function test_registration_screen_can_be_rendered(): void
    {
        $response = $this->get('/register');

        $response->assertStatus(200);
        $response->assertInertia(fn ($page) => $page
            ->component('Auth/Register')
            ->has('skillOptions')
            ->has('experienceLabels'));
    }

    public function test_new_coders_can_register(): void
    {
        $response = $this->post('/register', [
            'name' => 'Test Coder',
            'email' => 'coder@example.com',
            'password' => 'password',
            'password_confirmation' => 'password',
            'bio' => 'Fullstack developer with Laravel and React.',
            'skills' => ['Backend', 'Frontend'],
            'experience_level' => 50,
            'nda_accepted' => '1',
        ]);

        $this->assertAuthenticated();
        $response->assertRedirect(route('cabinet.coder-application.show', absolute: false));

        $user = User::query()->where('email', 'coder@example.com')->first();
        $this->assertNotNull($user);
        $this->assertTrue($user->hasRole('coder'));

        $application = CoderApplication::query()->where('user_id', $user->id)->first();
        $this->assertNotNull($application);
        $this->assertSame(50, $application->experience_level);
        $this->assertEqualsCanonicalizing(['Backend', 'Frontend'], $application->skills);
        $this->assertSame('pending', $application->status->value);
    }
}
