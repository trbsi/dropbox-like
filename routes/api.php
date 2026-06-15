<?php

use App\Source\FileSystem\App\Controllers\FileSystemController;
use Illuminate\Support\Facades\Route;

Route::prefix('filesystem')->group(function () {
    Route::get('nodes', [FileSystemController::class, 'nodes']);
    Route::get('search', [FileSystemController::class, 'search']);
    Route::get('nodes/{id}/ancestors', [FileSystemController::class, 'ancestors']);
    Route::post('nodes', [FileSystemController::class, 'store']);
    Route::delete('nodes/{id}', [FileSystemController::class, 'destroy']);
});
