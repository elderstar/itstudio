<?php

use App\Http\Controllers\Cabinet\CoderApplicationController;
use App\Http\Controllers\Cabinet\CoderFeedController;
use App\Http\Controllers\Cabinet\MessageController;
use App\Http\Controllers\Cabinet\NotificationController;
use App\Http\Controllers\Cabinet\OrderController;
use App\Http\Controllers\Cabinet\OrderFileController;
use App\Http\Controllers\Cabinet\OrderJoinRequestController;
use App\Http\Controllers\Cabinet\OrderStageController;
use App\Http\Controllers\HomeController;
use App\Http\Controllers\LeadController;
use App\Http\Controllers\MediaDownloadController;
use App\Http\Controllers\ProfileController;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

Route::get('/', HomeController::class)->name('home');

Route::post('/leads', [LeadController::class, 'store'])
    ->middleware('throttle:10,1')
    ->name('leads.store');

Route::get('/dashboard', function () {
    $user = auth()->user();

    if ($user?->hasRole('admin')) {
        // Full document visit so Filament head scripts (dark theme) apply on first paint.
        return Inertia::location('/admin');
    }

    if ($user?->isApprovedCoder()) {
        return redirect()->route('cabinet.feed.index');
    }

    return redirect()->route('cabinet.orders.index');
})->middleware(['auth', 'verified'])->name('dashboard');

Route::middleware(['auth', 'verified'])->prefix('cabinet')->name('cabinet.')->group(function () {
    Route::get('/orders', [OrderController::class, 'index'])->name('orders.index');
    Route::get('/orders/{order}', [OrderController::class, 'show'])->name('orders.show');
    Route::post('/orders/{order}/approve-stages', [OrderController::class, 'approveStages'])->name('orders.approve-stages');

    Route::get('/orders/{order}/chat', [MessageController::class, 'index'])->name('orders.chat');
    Route::post('/orders/{order}/chat', [MessageController::class, 'store'])->name('orders.chat.store');

    Route::get('/orders/{order}/files', [OrderFileController::class, 'index'])->name('orders.files');
    Route::post('/orders/{order}/files', [OrderFileController::class, 'store'])->name('orders.files.store');

    Route::get('/orders/{order}/stages', [OrderStageController::class, 'index'])->name('orders.stages');

    Route::get('/feed', [CoderFeedController::class, 'index'])->name('feed.index');
    Route::get('/feed/{order}', [CoderFeedController::class, 'show'])->name('feed.show');
    Route::post('/feed/{order}/join', [OrderJoinRequestController::class, 'store'])->name('feed.join');

    Route::get('/coder-application', [CoderApplicationController::class, 'show'])->name('coder-application.show');
    Route::post('/coder-application', [CoderApplicationController::class, 'store'])->name('coder-application.store');

    Route::get('/notifications', [NotificationController::class, 'index'])->name('notifications.index');
    Route::post('/notifications/{id}/read', [NotificationController::class, 'markRead'])->name('notifications.read');
    Route::post('/notifications/read-all', [NotificationController::class, 'markAllRead'])->name('notifications.read-all');
});

Route::middleware('auth')->group(function () {
    Route::get('/media/{media}', MediaDownloadController::class)->name('media.download');
    Route::get('/profile', [ProfileController::class, 'edit'])->name('profile.edit');
    Route::patch('/profile', [ProfileController::class, 'update'])->name('profile.update');
    Route::post('/profile/avatar', [ProfileController::class, 'updateAvatar'])->name('profile.avatar');
    Route::delete('/profile', [ProfileController::class, 'destroy'])->name('profile.destroy');
});

require __DIR__.'/auth.php';
