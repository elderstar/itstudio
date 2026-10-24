<?php

namespace App\Models;

use App\Enums\OrderStatus;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\SoftDeletes;
use Spatie\Activitylog\Models\Concerns\LogsActivity;
use Spatie\Activitylog\Support\LogOptions;
use Spatie\MediaLibrary\HasMedia;
use Spatie\MediaLibrary\InteractsWithMedia;

class Order extends Model implements HasMedia
{
    use InteractsWithMedia, LogsActivity, SoftDeletes;

    protected $fillable = [
        'client_id',
        'lead_id',
        'title',
        'category',
        'description',
        'brief',
        'status',
        'recruiting_open',
        'hide_budget_from_coders',
        'budget',
        'stages_approved_at',
    ];

    protected function casts(): array
    {
        return [
            'status' => OrderStatus::class,
            'recruiting_open' => 'boolean',
            'hide_budget_from_coders' => 'boolean',
            'budget' => 'decimal:2',
            'stages_approved_at' => 'datetime',
        ];
    }

    public function getActivitylogOptions(): LogOptions
    {
        return LogOptions::defaults()
            ->logFillable()
            ->logOnlyDirty();
    }

    public function registerMediaCollections(): void
    {
        $this->addMediaCollection('files')
            ->useDisk('local');
    }

    public function client(): BelongsTo
    {
        return $this->belongsTo(User::class, 'client_id');
    }

    public function lead(): BelongsTo
    {
        return $this->belongsTo(Lead::class);
    }

    public function tags(): BelongsToMany
    {
        return $this->belongsToMany(SpecialistTag::class, 'order_specialist_tag');
    }

    public function participants(): HasMany
    {
        return $this->hasMany(OrderParticipant::class);
    }

    public function activeParticipants(): HasMany
    {
        return $this->participants()
            ->whereNotNull('joined_at')
            ->whereNull('left_at');
    }

    public function joinRequests(): HasMany
    {
        return $this->hasMany(OrderJoinRequest::class);
    }

    public function stages(): HasMany
    {
        return $this->hasMany(OrderStage::class)->orderBy('position');
    }

    public function stageEdges(): HasMany
    {
        return $this->hasMany(OrderStageEdge::class);
    }

    public function messages(): HasMany
    {
        return $this->hasMany(Message::class);
    }

    public function closeRecruiting(): void
    {
        $this->update([
            'recruiting_open' => false,
            'status' => OrderStatus::Active,
        ]);
    }
}
