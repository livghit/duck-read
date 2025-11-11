<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('book_cache_metadata', function (Blueprint $table) {
            $table->id();
            $table->foreignId('book_id')->constrained('books')->cascadeOnDelete();
            $table->string('cache_key')->unique();
            $table->timestamp('expires_at')->nullable();
            $table->integer('hit_count')->default(0);
            $table->timestamps();
            $table->index('expires_at');
            $table->index('hit_count');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('book_cache_metadata');
    }
};
