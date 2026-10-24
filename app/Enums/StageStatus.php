<?php

namespace App\Enums;

enum StageStatus: string
{
    case Pending = 'pending';
    case InProgress = 'in_progress';
    case Completed = 'completed';

    public function label(): string
    {
        return match ($this) {
            self::Pending => 'Ожидает',
            self::InProgress => 'В работе',
            self::Completed => 'Готово',
        };
    }
}
