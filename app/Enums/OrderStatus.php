<?php

namespace App\Enums;

enum OrderStatus: string
{
    case Draft = 'draft';
    case Recruiting = 'recruiting';
    case Active = 'active';
    case Completed = 'completed';
    case Closed = 'closed';

    public function label(): string
    {
        return match ($this) {
            self::Draft => 'Черновик',
            self::Recruiting => 'Набор',
            self::Active => 'В работе',
            self::Completed => 'Завершён',
            self::Closed => 'Закрыт',
        };
    }
}
