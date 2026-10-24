<?php

namespace App\Filament\Resources;

use App\Filament\Resources\SpecialistTagResource\Pages;
use App\Models\SpecialistTag;
use Filament\Forms;
use Filament\Forms\Form;
use Filament\Resources\Resource;
use Filament\Tables;
use Filament\Tables\Table;

class SpecialistTagResource extends Resource
{
    protected static ?string $model = SpecialistTag::class;

    protected static ?string $navigationIcon = 'heroicon-o-tag';

    protected static ?string $navigationLabel = 'Теги';

    protected static ?string $modelLabel = 'Тег';

    protected static ?int $navigationSort = 5;

    public static function form(Form $form): Form
    {
        return $form->schema([
            Forms\Components\TextInput::make('name')->required()->maxLength(255),
            Forms\Components\TextInput::make('slug')->maxLength(255)->helperText('Оставьте пустым для автогенерации'),
        ]);
    }

    public static function table(Table $table): Table
    {
        return $table
            ->columns([
                Tables\Columns\TextColumn::make('name')->searchable(),
                Tables\Columns\TextColumn::make('slug'),
                Tables\Columns\TextColumn::make('orders_count')->counts('orders')->label('Заказов'),
            ])
            ->actions([
                Tables\Actions\EditAction::make(),
                Tables\Actions\DeleteAction::make(),
            ])
            ->bulkActions([
                Tables\Actions\BulkActionGroup::make([
                    Tables\Actions\DeleteBulkAction::make(),
                ]),
            ]);
    }

    public static function getPages(): array
    {
        return [
            'index' => Pages\ListSpecialistTags::route('/'),
            'create' => Pages\CreateSpecialistTag::route('/create'),
            'edit' => Pages\EditSpecialistTag::route('/{record}/edit'),
        ];
    }
}
