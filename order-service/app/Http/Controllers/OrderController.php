<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Order;
use Illuminate\Support\Facades\Http;

class OrderController extends Controller
{
    public function store(Request $request)
    {
        // 1. Validasi User ke User Service (Node.js Port 4000)
        // Kita cek dulu apakah user dengan UUID tersebut ada di database user
        $userUrl = "http://localhost:4000/users/{$request->user_id}";
        $userResponse = Http::get($userUrl);

        if ($userResponse->failed()) {
            return response()->json([
                'status' => 'Error',
                'message' => 'Gagal membuat pesanan: User ID tidak ditemukan di User Service!'
            ], 404);
        }

        // 2. Jika user valid, simpan data order ke database Laravel (db_order_service)
        $order = Order::create([
            'user_id'    => $request->user_id,
            'product_id' => $request->product_id,
            'jumlah'     => $request->qty
        ]);

        // 3. Nembak ke Product Service (Node.js Port 3000) untuk kurangi stok
        $productUrl = "http://localhost:3000/products/{$request->product_id}/reduce-stock";
        $productResponse = Http::patch($productUrl, [
            'qty' => $request->qty
        ]);

        //Nembak ke Payment Service (Laravel Port 8001)
        // Asumsi harga barang per item adalah Rp 50.000
        $totalHarga = $request->qty * 50000; 
        $paymentUrl = "http://127.0.0.1:8001/api/payments";
        
        $paymentResponse = Http::post($paymentUrl, [
            'order_id' => $order->id, // Mengirim UUID Order yang baru dibuat
            'user_id'  => $request->user_id,
            'amount'   => $totalHarga
        ]);

        // 4. Kembalikan jawaban lengkap ke Postman
        return response()->json([
            'status' => 'Order Created Successfully!',
            'data_order' => $order,
            'user_service_info' => $userResponse->json(),
            'product_service_info' => $productResponse->json(),
            'payment_service_info' => $paymentResponse->json()
        ]);
    }
}
