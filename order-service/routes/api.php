<?php

use App\Http\Controllers\OrderController;
use Illuminate\Support\Facades\Route;

// Laravel otomatis menambahkan prefix /api, jadi cukup tulis /orders
Route::post('/orders', [OrderController::class, 'store']);
