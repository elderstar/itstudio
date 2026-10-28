<?php

namespace App\Filament\Resources;

use App\Filament\Resources\OrderJoinRequestResource\Pages;
use App\Models\OrderJoinRequest;
use App\Services\OrderService;
use Filament\Forms;
use Filament\Forms\Form;
use Filament\Notifications\Notification;
use Filament\Resources\Resource;
use Filament\Tables;
use Filament\Tables\Table;

class OrderJoinRequestResource extends Resource
{
    protected static ?string $model = OrderJoinRequest::class;

    protected static ?string $navigationIcon = 'heroicon-o-hand-raised';

    protected static ?string $navigationLabel = 'Заявки в заказы';

    protected static ?string $modelLabel = 'Заявка';

    protected static ?string $pluralModelLabel = 'Заявки в заказы';

    protected static ?int $navigationSort = 4;

    public static function form(Form $form): Form
    {
        return $form->schema([
            Forms\Components\Select::make('order_id')->relationship('order', 'title')->disabled(),
            Forms\Components\Select::make('user_id')->relationship('user', 'name')->disabled(),
            Forms\Components\Textarea::make('message')->disabled()->columnSpanFull(),
            Forms\Components\Textarea::make('admin_note')->label('Заметка админа'),
        ]);
    }

    public static function table(Table $table): Table
    {
        return $table
            ->columns([
                Tables\Columns\TextColumn::make('order.title')->label('Заказ')->searchable(),
                Tables\Columns\TextColumn::make('user.name')->label('Кодер')->searchable(),
                Tables\Columns\TextColumn::make('status')->badge(),
                Tables\Columns\TextColumn::make('created_at')->dateTime()->sortable(),
            ])
            ->defaultSort('created_at', 'desc')
            ->filters([
                Tables\Filters\SelectFilter::make('status')
                    ->options([
                        'pending' => 'Ожидает',
                        'approved' => 'Одобрена',
                        'rejected' => 'Отклонена',
                    ]),
            ])
            ->actions([
                Tables\Actions\ViewAction::make(),
                Tables\Actions\Action::make('approve')
                    ->label('Принять')
                    ->color('success')
                    ->visible(fn (OrderJoinRequest $record) => $record->status->value === 'pending')
                    ->requiresConfirmation()
                    ->action(function (OrderJoinRequest $record, OrderService $orders): void {
                        $orders->approveJoinRequest($record, auth()->user());
                        Notification::make()->title('Кодер принят в заказ')->success()->send();
                    }),
                Tables\Actions\Action::make('reject')
                    ->label('Отклонить')
                    ->color('danger')
                    ->visible(fn (OrderJoinRequest $record) => $record->status->value === 'pending')
                    ->form([
                        Forms\Components\Textarea::make('admin_note')->label('Причина'),
                    ])
                    ->action(function (OrderJoinRequest $record, array $data, OrderService $orders): void {
                        $orders->rejectJoinRequest($record, auth()->user(), $data['admin_note'] ?? null);
                        Notification::make()->title('Заявка отклонена')->success()->send();
                    }),
            ]);
    }

    public static function getPages(): array
    {
        return [
            'index' => Pages\ListOrderJoinRequests::route('/'),
            'view' => Pages\ViewOrderJoinRequest::route('/{record}'),
        ];
    }

    public static function canCreate(): bool
    {
        return false;
    }
}
