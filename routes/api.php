<?php

use App\Source\FileSystem\App\Controllers\FileSystemController;
use Illuminate\Support\Facades\Route;

Route::prefix('filesystem')->group(function () {
    Route::get('nodes', [FileSystemController::class, 'nodes']);
    Route::get('search', [FileSystemController::class, 'search']);
});
