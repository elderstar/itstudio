<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('coder_applications', function (Blueprint $table) {
            $table->unsignedTinyInteger('experience_level')->default(0)->after('skills');
            $table->string('resume_url')->nullable()->after('portfolio_url');
        });
    }

    public function down(): void
    {
        Schema::table('coder_applications', function (Blueprint $table) {
            $table->dropColumn(['experience_level', 'resume_url']);
        });
    }
};
