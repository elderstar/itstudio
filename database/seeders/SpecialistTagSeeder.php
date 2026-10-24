<?php

namespace Database\Seeders;

use App\Models\SpecialistTag;
use Illuminate\Database\Seeder;

class SpecialistTagSeeder extends Seeder
{
    public function run(): void
    {
        $tags = [
            'Frontend',
            'Backend',
            'Fullstack',
            'DevOps',
            'UI/UX',
            'Mobile',
            'QA',
            'Data',
        ];

        foreach ($tags as $name) {
            SpecialistTag::query()->firstOrCreate(
                ['slug' => str($name)->slug()->toString()],
                ['name' => $name],
            );
        }
    }
}
