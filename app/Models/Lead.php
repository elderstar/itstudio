<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasOne;
use Illuminate\Database\Eloquent\SoftDeletes;

class Lead extends Model
{
    use SoftDeletes;

    protected $fillable = [
        'name',
        'email',
        'phone',
        'message',
        'intent',
        'intake',
        'status',
        'ip_address',
    ];

    protected function casts(): array
    {
        return [
            'intake' => 'array',
        ];
    }

    public function order(): HasOne
    {
        return $this->hasOne(Order::class);
    }

    public function intentLabel(): string
    {
        return match ($this->intent) {
            'has_problem' => 'Есть конкретная проблема',
            'want_improve' => 'Хочу понять, что улучшить',
            'need_dev' => 'Есть задача на разработку',
            'need_estimate' => 'Нужна оценка / команда',
            'just_chat' => 'Пока просто познакомиться',
            default => $this->intent ?: '—',
        };
    }
}
