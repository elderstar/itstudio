<?php

namespace App\Support;

final class CoderProfile
{
    /** @return list<string> */
    public static function skillOptions(): array
    {
        return [
            'Frontend',
            'Backend',
            'Fullstack',
            'DevOps',
            'UI/UX',
            'Mobile',
            'QA',
            'Data',
        ];
    }

    /**
     * Slider stops: newbie / junior / middle / senior.
     * Percentages are stored only in DB, never shown in UI.
     *
     * @return array<int, string>
     */
    public static function experienceLabels(): array
    {
        return [
            0 => 'Newbie',
            33 => 'Junior',
            66 => 'Middle',
            100 => 'Senior',
        ];
    }

    /** @return list<string> */
    public static function resumeMimeTypes(): array
    {
        return [
            'application/pdf',
            'image/png',
            'image/jpeg',
        ];
    }

    /** @return list<string> */
    public static function resumeExtensions(): array
    {
        return ['pdf', 'png', 'jpg', 'jpeg'];
    }

    public static function resumeRules(bool $required = false): array
    {
        $presence = $required ? ['required'] : ['nullable'];

        return array_merge($presence, [
            'file',
            'max:10240',
            'mimes:'.implode(',', self::resumeExtensions()),
            'mimetypes:'.implode(',', self::resumeMimeTypes()),
        ]);
    }
}
