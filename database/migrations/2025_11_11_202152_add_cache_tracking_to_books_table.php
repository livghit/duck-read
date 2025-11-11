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
        Schema::table('books', function (Blueprint $table) {
            $table->timestamp('ol_last_synced_at')->nullable()->after('external_id');
            $table->enum('ol_sync_status', ['pending', 'success', 'failed'])->default('pending')->after('ol_last_synced_at');
            $table->boolean('cached_from_ol')->default(false)->after('ol_sync_status');
            $table->index('ol_last_synced_at');
            $table->index('ol_sync_status');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('books', function (Blueprint $table) {
            $table->dropIndex('books_ol_last_synced_at_index');
            $table->dropIndex('books_ol_sync_status_index');
            $table->dropColumn(['ol_last_synced_at', 'ol_sync_status', 'cached_from_ol']);
        });
    }
};
