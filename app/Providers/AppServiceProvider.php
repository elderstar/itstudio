<?php

namespace App\Providers;

use App\Models\CoderApplication;
use App\Models\Message;
use App\Models\Order;
use App\Policies\CoderApplicationPolicy;
use App\Policies\MessagePolicy;
use App\Policies\OrderPolicy;
use Illuminate\Support\Facades\Gate;
use Illuminate\Support\Facades\Vite;
use Illuminate\Support\ServiceProvider;

class AppServiceProvider extends ServiceProvider
{
    public function register(): void
    {
        //
    }

    public function boot(): void
    {
        Vite::prefetch(concurrency: 3);

        Gate::policy(Order::class, OrderPolicy::class);
        Gate::policy(Message::class, MessagePolicy::class);
        Gate::policy(CoderApplication::class, CoderApplicationPolicy::class);
    }
}
