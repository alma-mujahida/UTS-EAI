<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

Route::post('/payments', function (Request $request) {
    $transactionId = 'TRX-' . strtoupper(uniqid());
    return response()->json([
        'status' => 'Success',
        'message' => 'Tagihan berhasil dibuat di Payment Service',
        'payment_details' => [
            'transaction_id' => $transactionId,
            'order_id' => $request->order_id,
            'amount_to_pay' => $request->amount,
            'payment_status' => 'Pending'
        ]
    ]);
});