<?php

namespace App\Filament\Resources;

use App\Enums\OrderStatus;
use App\Enums\StageStatus;
use App\Filament\Resources\OrderResource\Pages;
use App\Models\Order;
use App\Models\User;
use App\Services\OrderService;
use Filament\Forms;
use Filament\Forms\Form;
use Filament\Notifications\Notification;
use Filament\Resources\Resource;
use Filament\Tables;
use Filament\Tables\Table;
use Illuminate\Support\Facades\DB;

class OrderResource extends Resource
{
    protected static ?string $model = Order::class;

    protected static ?string $navigationIcon = 'heroicon-o-briefcase';

    protected static ?string $navigationLabel = 'Заказы';

    protected static ?string $modelLabel = 'Заказ';

    protected static ?int $navigationSort = 2;

    public static function form(Form $form): Form
    {
        return $form->schema([
            Forms\Components\Select::make('client_id')
                ->label('Клиент')
                ->relationship('client', 'name')
                ->searchable()
                ->required(),
            Forms\Components\TextInput::make('title')->required()->maxLength(255),
            Forms\Components\TextInput::make('category')->maxLength(100),
            Forms\Components\Select::make('status')
                ->options(collect(OrderStatus::cases())->mapWithKeys(
                    fn (OrderStatus $s) => [$s->value => $s->label()]
                ))
                ->required(),
            Forms\Components\Toggle::make('recruiting_open')->label('Набор открыт'),
            Forms\Components\Toggle::make('hide_budget_from_coders')->label('Скрыть бюджет'),
            Forms\Components\TextInput::make('budget')->numeric(),
            Forms\Components\Textarea::make('description')->columnSpanFull(),
            Forms\Components\Textarea::make('brief')->label('Brief / ТЗ')->columnSpanFull(),
            Forms\Components\Select::make('tags')
                ->relationship('tags', 'name')
                ->multiple()
                ->preload(),
            Forms\Components\Repeater::make('stages')
                ->relationship()
                ->schema([
                    Forms\Components\TextInput::make('title')->required(),
                    Forms\Components\Textarea::make('description'),
                    Forms\Components\Select::make('status')
                        ->options(collect(StageStatus::cases())->mapWithKeys(
                            fn (StageStatus $s) => [$s->value => $s->label()]
                        ))
                        ->default(StageStatus::Pending->value),
                    Forms\Components\TextInput::make('position')->numeric()->default(0),
                    Forms\Components\TextInput::make('position_x')->numeric()->default(0),
                    Forms\Components\TextInput::make('position_y')->numeric()->default(0),
                ])
                ->columnSpanFull()
                ->collapsed(),
        ]);
    }

    public static function table(Table $table): Table
    {
        return $table
            ->columns([
                Tables\Columns\TextColumn::make('id')->sortable(),
                Tables\Columns\TextColumn::make('title')->searchable(),
                Tables\Columns\TextColumn::make('client.name')->label('Клиент'),
                Tables\Columns\TextColumn::make('status')->badge(),
                Tables\Columns\IconColumn::make('recruiting_open')->boolean()->label('Набор'),
                Tables\Columns\TextColumn::make('updated_at')->dateTime()->sortable(),
            ])
            ->defaultSort('updated_at', 'desc')
            ->actions([
                Tables\Actions\EditAction::make(),
                Tables\Actions\Action::make('closeRecruiting')
                    ->label('Закрыть набор')
                    ->icon('heroicon-o-lock-closed')
                    ->visible(fn (Order $record) => $record->recruiting_open)
                    ->requiresConfirmation()
                    ->action(function (Order $record): void {
                        $record->closeRecruiting();
                        activity()->causedBy(auth()->user())->performedOn($record)->log('recruiting_closed');
                        Notification::make()->title('Набор закрыт')->success()->send();
                    }),
                Tables\Actions\Action::make('addParticipant')
                    ->label('Добавить участника')
                    ->form([
                        Forms\Components\Select::make('user_id')
                            ->label('Пользователь')
                            ->options(fn () => User::role('coder')->pluck('name', 'id'))
                            ->searchable()
                            ->required(),
                    ])
                    ->action(function (Order $record, array $data): void {
                        $record->participants()->updateOrCreate(
                            ['user_id' => $data['user_id']],
                            ['role' => 'coder', 'joined_at' => now(), 'left_at' => null],
                        );
                        activity()->causedBy(auth()->user())->performedOn($record)
                            ->withProperties(['user_id' => $data['user_id']])
                            ->log('participant_added');
                        Notification::make()->title('Участник добавлен')->success()->send();
                    }),
                Tables\Actions\Action::make('kickParticipant')
                    ->label('Исключить')
                    ->color('danger')
                    ->form([
                        Forms\Components\Select::make('user_id')
                            ->label('Участник')
                            ->options(fn (Order $record) => $record->activeParticipants()
                                ->with('user')
                                ->get()
                                ->mapWithKeys(fn ($p) => [$p->user_id => $p->user->name.' ('.$p->role.')']))
                            ->required(),
                    ])
                    ->action(function (Order $record, array $data, OrderService $orders): void {
                        $user = User::query()->findOrFail($data['user_id']);
                        $orders->kickParticipant($record, $user, auth()->user());
                        Notification::make()->title('Участник исключён')->success()->send();
                    }),
                Tables\Actions\Action::make('syncStageEdges')
                    ->label('Связать этапы по порядку')
                    ->action(function (Order $record): void {
                        DB::transaction(function () use ($record) {
                            $record->stageEdges()->delete();
                            $stages = $record->stages()->orderBy('position')->get();
                            for ($i = 0; $i < $stages->count() - 1; $i++) {
                                $record->stageEdges()->create([
                                    'source_stage_id' => $stages[$i]->id,
                                    'target_stage_id' => $stages[$i + 1]->id,
                                ]);
                            }
                        });
                        Notification::make()->title('Связи этапов обновлены')->success()->send();
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
            'index' => Pages\ListOrders::route('/'),
            'create' => Pages\CreateOrder::route('/create'),
            'edit' => Pages\EditOrder::route('/{record}/edit'),
        ];
    }
}
