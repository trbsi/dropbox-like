<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::table('filesystems', function (Blueprint $table) {
            //  covers the folder listing query entirely
            //  already sorted folders-first, then alphabetically. No filesort needed.
            $table->index(['parent_id', 'type', 'name']);

            // covers the search query (WHERE type = 'file' AND name LIKE 'prefix%' LIMIT 10).
            //  Prefix LIKE with a trailing % uses a B-tree range scan
            $table->index(['type', 'name']);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('filesystems', function (Blueprint $table) {
            $table->dropForeign(['parent_id']);
            $table->dropIndex(['parent_id', 'type', 'name']);
            $table->dropIndex(['type', 'name']);
            $table->foreign('parent_id')->references('id')->on('filesystems')->cascadeOnDelete();
        });
    }
};
