<?php

use Illuminate\Support\Number;

if (! function_exists('format_count')) {
    /**
     * Format integers for UI. Uses intl when available; falls back without it
     * so Filament tables still render on hosts where php-intl is disabled.
     */
    function format_count(int|float|null $number, ?string $locale = null): string
    {
        $number ??= 0;

        if (extension_loaded('intl')) {
            return Number::format($number, locale: $locale) ?? (string) $number;
        }

        return number_format((float) $number, 0, '.', ' ');
    }
}
