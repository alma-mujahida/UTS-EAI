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
        Schema::create('orders', function (Blueprint $table) {
            // Menggunakan UUID sebagai Primary Key sesuai instruksi
            $table->uuid('id')->primary();

            // kolom untuk user
            $table->uuid('user_id');
            // Kolom untuk menampung UUID produk dari Product Service (Node.js)
            $table->uuid('product_id');

            // Kolom untuk jumlah pesanan
            $table->integer('jumlah');

            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('orders');
    }
};
