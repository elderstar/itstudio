<?php

namespace App\Models;

use App\Enums\CoderApplicationStatus;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\SoftDeletes;
use Spatie\Activitylog\Models\Concerns\LogsActivity;
use Spatie\Activitylog\Support\LogOptions;
use Spatie\MediaLibrary\HasMedia;
use Spatie\MediaLibrary\InteractsWithMedia;

class CoderApplication extends Model implements HasMedia
{
    use InteractsWithMedia, LogsActivity, SoftDeletes;

    protected $fillable = [
        'user_id',
        'headline',
        'bio',
        'skills',
        'experience_level',
        'portfolio_url',
        'resume_url',
        'status',
        'admin_note',
        'reviewed_at',
        'reviewed_by',
        'nda_accepted',
        'nda_accepted_at',
    ];

    protected function casts(): array
    {
        return [
            'skills' => 'array',
            'experience_level' => 'integer',
            'status' => CoderApplicationStatus::class,
            'reviewed_at' => 'datetime',
            'nda_accepted' => 'boolean',
            'nda_accepted_at' => 'datetime',
        ];
    }

    public function registerMediaCollections(): void
    {
        $this->addMediaCollection('resume')
            ->singleFile()
            ->useDisk('local');
    }

    public function getActivitylogOptions(): LogOptions
    {
        return LogOptions::defaults()
            ->logFillable()
            ->logOnlyDirty();
    }

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    public function reviewer(): BelongsTo
    {
        return $this->belongsTo(User::class, 'reviewed_by');
    }

    public function resumeFileUrl(): ?string
    {
        $media = $this->getFirstMedia('resume');

        return $media ? route('media.download', $media) : null;
    }

    public function resumeFileName(): ?string
    {
        return $this->getFirstMedia('resume')?->file_name;
    }
}
