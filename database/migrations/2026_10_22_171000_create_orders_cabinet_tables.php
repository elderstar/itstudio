<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('specialist_tags', function (Blueprint $table) {
            $table->id();
            $table->string('name');
            $table->string('slug')->unique();
            $table->timestamps();
        });

        Schema::create('orders', function (Blueprint $table) {
            $table->id();
            $table->foreignId('client_id')->constrained('users')->cascadeOnDelete();
            $table->foreignId('lead_id')->nullable()->constrained('leads')->nullOnDelete();
            $table->string('title');
            $table->string('category')->nullable();
            $table->text('description')->nullable();
            $table->text('brief')->nullable();
            $table->string('status')->default('draft');
            $table->boolean('recruiting_open')->default(true);
            $table->boolean('hide_budget_from_coders')->default(true);
            $table->decimal('budget', 12, 2)->nullable();
            $table->timestamp('stages_approved_at')->nullable();
            $table->timestamps();
            $table->softDeletes();
        });

        Schema::create('order_specialist_tag', function (Blueprint $table) {
            $table->id();
            $table->foreignId('order_id')->constrained()->cascadeOnDelete();
            $table->foreignId('specialist_tag_id')->constrained()->cascadeOnDelete();
            $table->unique(['order_id', 'specialist_tag_id']);
        });

        Schema::create('order_participants', function (Blueprint $table) {
            $table->id();
            $table->foreignId('order_id')->constrained()->cascadeOnDelete();
            $table->foreignId('user_id')->constrained()->cascadeOnDelete();
            $table->string('role')->default('coder');
            $table->timestamp('joined_at')->nullable();
            $table->timestamp('left_at')->nullable();
            $table->timestamp('last_read_at')->nullable();
            $table->timestamps();
            $table->unique(['order_id', 'user_id']);
        });

        Schema::create('coder_applications', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained()->cascadeOnDelete();
            $table->string('headline')->nullable();
            $table->text('bio')->nullable();
            $table->json('skills')->nullable();
            $table->string('portfolio_url')->nullable();
            $table->string('status')->default('pending');
            $table->text('admin_note')->nullable();
            $table->timestamp('reviewed_at')->nullable();
            $table->foreignId('reviewed_by')->nullable()->constrained('users')->nullOnDelete();
            $table->boolean('nda_accepted')->default(false);
            $table->timestamp('nda_accepted_at')->nullable();
            $table->timestamps();
            $table->softDeletes();
        });

        Schema::create('order_join_requests', function (Blueprint $table) {
            $table->id();
            $table->foreignId('order_id')->constrained()->cascadeOnDelete();
            $table->foreignId('user_id')->constrained()->cascadeOnDelete();
            $table->text('message')->nullable();
            $table->string('status')->default('pending');
            $table->text('admin_note')->nullable();
            $table->timestamp('reviewed_at')->nullable();
            $table->foreignId('reviewed_by')->nullable()->constrained('users')->nullOnDelete();
            $table->timestamps();
            $table->unique(['order_id', 'user_id']);
        });

        Schema::create('order_stages', function (Blueprint $table) {
            $table->id();
            $table->foreignId('order_id')->constrained()->cascadeOnDelete();
            $table->string('title');
            $table->text('description')->nullable();
            $table->string('status')->default('pending');
            $table->unsignedInteger('position')->default(0);
            $table->float('position_x')->default(0);
            $table->float('position_y')->default(0);
            $table->timestamp('completed_at')->nullable();
            $table->timestamps();
        });

        Schema::create('order_stage_edges', function (Blueprint $table) {
            $table->id();
            $table->foreignId('order_id')->constrained()->cascadeOnDelete();
            $table->foreignId('source_stage_id')->constrained('order_stages')->cascadeOnDelete();
            $table->foreignId('target_stage_id')->constrained('order_stages')->cascadeOnDelete();
            $table->timestamps();
        });

        Schema::create('messages', function (Blueprint $table) {
            $table->id();
            $table->foreignId('order_id')->constrained()->cascadeOnDelete();
            $table->foreignId('user_id')->constrained()->cascadeOnDelete();
            $table->foreignId('parent_id')->nullable()->constrained('messages')->nullOnDelete();
            $table->text('body');
            $table->timestamps();
            $table->softDeletes();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('messages');
        Schema::dropIfExists('order_stage_edges');
        Schema::dropIfExists('order_stages');
        Schema::dropIfExists('order_join_requests');
        Schema::dropIfExists('coder_applications');
        Schema::dropIfExists('order_participants');
        Schema::dropIfExists('order_specialist_tag');
        Schema::dropIfExists('orders');
        Schema::dropIfExists('specialist_tags');
    }
};
