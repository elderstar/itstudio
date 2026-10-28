<?php

namespace App\Filament\Resources;

use App\Filament\Resources\LeadResource\Pages;
use App\Models\Lead;
use App\Models\SpecialistTag;
use App\Services\OrderService;
use Filament\Forms;
use Filament\Forms\Form;
use Filament\Notifications\Notification;
use Filament\Resources\Resource;
use Filament\Tables;
use Filament\Tables\Table;

class LeadResource extends Resource
{
    protected static ?string $model = Lead::class;

    protected static ?string $navigationIcon = 'heroicon-o-inbox';

    protected static ?string $navigationLabel = 'Лиды';

    protected static ?string $modelLabel = 'Лид';

    protected static ?string $pluralModelLabel = 'Лиды';

    protected static ?int $navigationSort = 1;

    public static function form(Form $form): Form
    {
        return $form
            ->schema([
                Forms\Components\TextInput::make('name')->required()->maxLength(255),
                Forms\Components\TextInput::make('email')->email()->maxLength(255),
                Forms\Components\TextInput::make('phone')->tel()->maxLength(255),
                Forms\Components\TextInput::make('intent')->label('Намерение')->disabled(),
                Forms\Components\Textarea::make('message')->required()->columnSpanFull(),
                Forms\Components\Textarea::make('intake_preview')
                    ->label('Intake')
                    ->disabled()
                    ->rows(8)
                    ->dehydrated(false)
                    ->formatStateUsing(fn (?Lead $record) => $record
                        ? json_encode($record->intake, JSON_PRETTY_PRINT | JSON_UNESCAPED_UNICODE)
                        : null)
                    ->columnSpanFull(),
                Forms\Components\Select::make('status')
                    ->options([
                        'new' => 'Новый',
                        'in_progress' => 'В работе',
                        'converted' => 'Конвертирован',
                        'rejected' => 'Отклонён',
                    ])
                    ->required(),
            ]);
    }

    public static function table(Table $table): Table
    {
        return $table
            ->columns([
                Tables\Columns\TextColumn::make('name')->searchable(),
                Tables\Columns\TextColumn::make('email')->searchable(),
                Tables\Columns\TextColumn::make('intent')
                    ->label('Намерение')
                    ->formatStateUsing(fn (?string $state, Lead $record) => $record->intentLabel())
                    ->toggleable(),
                Tables\Columns\TextColumn::make('phone'),
                Tables\Columns\TextColumn::make('status')->badge(),
                Tables\Columns\TextColumn::make('created_at')->dateTime()->sortable(),
            ])
            ->defaultSort('created_at', 'desc')
            ->filters([])
            ->actions([
                Tables\Actions\ViewAction::make(),
                Tables\Actions\EditAction::make(),
                // TODO(cabinet-lead-handoff): после convert — invite/письмо клиенту в кабинет.
                // docs/CABINET_UX.md#lead--client-path--cabinet-lead-handoff
                Tables\Actions\Action::make('convert')
                    ->label('Создать заказ')
                    ->icon('heroicon-o-shopping-bag')
                    ->visible(fn (Lead $record) => $record->status !== 'converted' && ! $record->order)
                    ->form([
                        Forms\Components\TextInput::make('title')
                            ->label('Название')
                            ->required()
                            ->default(fn (Lead $record) => 'Заказ: '.$record->name),
                        Forms\Components\TextInput::make('category')->label('Категория'),
                        Forms\Components\Textarea::make('description')->label('Описание')
                            ->default(fn (Lead $record) => $record->message),
                        Forms\Components\Textarea::make('brief')->label('Brief / ТЗ'),
                        Forms\Components\TextInput::make('budget')->numeric()->label('Бюджет'),
                        Forms\Components\Toggle::make('hide_budget_from_coders')
                            ->label('Скрыть бюджет от кодеров')
                            ->default(true),
                        Forms\Components\Select::make('tag_ids')
                            ->label('Теги специалистов')
                            ->multiple()
                            ->options(fn () => SpecialistTag::query()->pluck('name', 'id')),
                    ])
                    ->action(function (Lead $record, array $data, OrderService $orders): void {
                        $order = $orders->createFromLead($record, $data, auth()->user());
                        Notification::make()
                            ->title('Заказ #'.$order->id.' создан')
                            ->success()
                            ->send();
                    }),
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
            'index' => Pages\ListLeads::route('/'),
            'create' => Pages\CreateLead::route('/create'),
            'view' => Pages\ViewLead::route('/{record}'),
            'edit' => Pages\EditLead::route('/{record}/edit'),
        ];
    }
}
