<?php

namespace App\Enums;

enum CoderApplicationStatus: string
{
    case Pending = 'pending';
    case Approved = 'approved';
    case Rejected = 'rejected';

    public function label(): string
    {
        return match ($this) {
            self::Pending => 'На проверке',
            self::Approved => 'Одобрена',
            self::Rejected => 'Отклонена',
        };
    }
}
