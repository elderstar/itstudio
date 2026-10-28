<?php

namespace App\Filament\Resources;

use App\Filament\Resources\CoderApplicationResource\Pages;
use App\Models\CoderApplication;
use App\Services\CoderApplicationService;
use Filament\Forms;
use Filament\Forms\Form;
use Filament\Notifications\Notification;
use Filament\Resources\Resource;
use Filament\Tables;
use Filament\Tables\Table;

class CoderApplicationResource extends Resource
{
    protected static ?string $model = CoderApplication::class;

    protected static ?string $navigationIcon = 'heroicon-o-user-plus';

    protected static ?string $navigationLabel = 'Анкеты кодеров';

    protected static ?string $modelLabel = 'Анкета';

    protected static ?string $pluralModelLabel = 'Анкеты кодеров';

    protected static ?int $navigationSort = 3;

    public static function form(Form $form): Form
    {
        return $form->schema([
            Forms\Components\Select::make('user_id')->relationship('user', 'name')->disabled(),
            Forms\Components\TextInput::make('headline')->disabled(),
            Forms\Components\Textarea::make('bio')->disabled()->columnSpanFull(),
            Forms\Components\TagsInput::make('skills')->disabled(),
            Forms\Components\TextInput::make('experience_level')
                ->label('Уровень %')
                ->disabled()
                ->helperText('0 newbie · 33 junior · 66 middle · 100 senior'),
            Forms\Components\TextInput::make('resume_url')->label('Resume URL')->disabled(),
            Forms\Components\TextInput::make('portfolio_url')->disabled(),
            Forms\Components\Textarea::make('admin_note')->label('Заметка админа'),
        ]);
    }

    public static function table(Table $table): Table
    {
        return $table
            ->columns([
                Tables\Columns\TextColumn::make('user.name')->searchable()->label('Кодер'),
                Tables\Columns\TextColumn::make('headline')->limit(40),
                Tables\Columns\TextColumn::make('experience_level')
                    ->label('Lvl %')
                    ->sortable(),
                Tables\Columns\TextColumn::make('status')->badge(),
                Tables\Columns\IconColumn::make('nda_accepted')->boolean()->label('NDA'),
                Tables\Columns\TextColumn::make('created_at')->dateTime()->sortable(),
            ])
            ->defaultSort('created_at', 'desc')
            ->filters([
                Tables\Filters\SelectFilter::make('status')
                    ->options([
                        'pending' => 'На проверке',
                        'approved' => 'Одобрена',
                        'rejected' => 'Отклонена',
                    ]),
            ])
            ->actions([
                Tables\Actions\ViewAction::make(),
                Tables\Actions\Action::make('approve')
                    ->label('Одобрить')
                    ->color('success')
                    ->visible(fn (CoderApplication $record) => $record->status->value === 'pending')
                    ->requiresConfirmation()
                    ->action(function (CoderApplication $record, CoderApplicationService $service): void {
                        $service->approve($record, auth()->user());
                        Notification::make()->title('Анкета одобрена')->success()->send();
                    }),
                Tables\Actions\Action::make('reject')
                    ->label('Отклонить')
                    ->color('danger')
                    ->visible(fn (CoderApplication $record) => $record->status->value === 'pending')
                    ->form([
                        Forms\Components\Textarea::make('admin_note')->label('Причина'),
                    ])
                    ->action(function (CoderApplication $record, array $data, CoderApplicationService $service): void {
                        $service->reject($record, auth()->user(), $data['admin_note'] ?? null);
                        Notification::make()->title('Анкета отклонена')->success()->send();
                    }),
            ]);
    }

    public static function getPages(): array
    {
        return [
            'index' => Pages\ListCoderApplications::route('/'),
            'view' => Pages\ViewCoderApplication::route('/{record}'),
        ];
    }

    public static function canCreate(): bool
    {
        return false;
    }
}
