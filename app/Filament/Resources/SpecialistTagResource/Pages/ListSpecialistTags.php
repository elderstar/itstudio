<?php

namespace App\Filament\Resources\SpecialistTagResource\Pages;

use App\Filament\Resources\SpecialistTagResource;
use Filament\Actions;
use Filament\Resources\Pages\ListRecords;

class ListSpecialistTags extends ListRecords
{
    protected static string $resource = SpecialistTagResource::class;

    protected function getHeaderActions(): array
    {
        return [
            Actions\CreateAction::make(),
        ];
    }
}
