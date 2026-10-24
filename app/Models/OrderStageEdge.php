<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class OrderStageEdge extends Model
{
    protected $fillable = [
        'order_id',
        'source_stage_id',
        'target_stage_id',
    ];

    public function order(): BelongsTo
    {
        return $this->belongsTo(Order::class);
    }

    public function source(): BelongsTo
    {
        return $this->belongsTo(OrderStage::class, 'source_stage_id');
    }

    public function target(): BelongsTo
    {
        return $this->belongsTo(OrderStage::class, 'target_stage_id');
    }
}
