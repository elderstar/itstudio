<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class OrderParticipant extends Model
{
    // TODO(cabinet-chat-participant): поле категории ответственности в заказе
    // (specialty / responsibility_label: Бекенд, Фронтенд, Дизайн…) — не путать с role client|coder.
    // Клиенту в чате только name + категория; без skills. docs/CABINET_UX.md#chat-participant-category--cabinet-chat-participant

    protected $fillable = [
        'order_id',
        'user_id',
        'role',
        'joined_at',
        'left_at',
        'last_read_at',
    ];

    protected function casts(): array
    {
        return [
            'joined_at' => 'datetime',
            'left_at' => 'datetime',
            'last_read_at' => 'datetime',
        ];
    }

    public function order(): BelongsTo
    {
        return $this->belongsTo(Order::class);
    }

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    public function isActive(): bool
    {
        return $this->joined_at !== null && $this->left_at === null;
    }
}
