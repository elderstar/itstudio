<?php

namespace App\Models;

use App\Enums\StageStatus;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class OrderStage extends Model
{
    protected $fillable = [
        'order_id',
        'title',
        'description',
        'status',
        'position',
        'position_x',
        'position_y',
        'completed_at',
    ];

    protected function casts(): array
    {
        return [
            'status' => StageStatus::class,
            'completed_at' => 'datetime',
            'position_x' => 'float',
            'position_y' => 'float',
        ];
    }

    public function order(): BelongsTo
    {
        return $this->belongsTo(Order::class);
    }

    public function outgoingEdges(): HasMany
    {
        return $this->hasMany(OrderStageEdge::class, 'source_stage_id');
    }

    public function incomingEdges(): HasMany
    {
        return $this->hasMany(OrderStageEdge::class, 'target_stage_id');
    }
}
