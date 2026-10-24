<?php

namespace App\Filament\Resources\OrderResource\Pages;

use App\Filament\Resources\OrderResource;
use Filament\Resources\Pages\CreateRecord;

class CreateOrder extends CreateRecord
{
    protected static string $resource = OrderResource::class;

    protected function afterCreate(): void
    {
        $order = $this->record;
        $order->participants()->firstOrCreate(
            ['user_id' => $order->client_id],
            ['role' => 'client', 'joined_at' => now()],
        );
    }
}
