<?php

use App\Source\FileSystem\Domain\Enum\FileSystemEnum;
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
        Schema::create('filesystems', function (Blueprint $table) {
            $table->id();
            $table->unsignedBigInteger('parent_id')->nullable();
            $table->string('name');
            $table->enum('type', [FileSystemEnum::File->value, FileSystemEnum::Folder->value]);
            $table->timestamps();

            $table->foreign('parent_id')->references('id')->on('filesystems')->cascadeOnDelete();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('filesystems');
    }
};
