<?php

namespace App\Enums;

enum JoinRequestStatus: string
{
    case Pending = 'pending';
    case Approved = 'approved';
    case Rejected = 'rejected';

    public function label(): string
    {
        return match ($this) {
            self::Pending => 'Ожидает',
            self::Approved => 'Одобрена',
            self::Rejected => 'Отклонена',
        };
    }
}
