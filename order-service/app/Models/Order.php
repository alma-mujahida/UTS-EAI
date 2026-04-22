<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Concerns\HasUuids;

class Order extends Model
{
    use HasUuids; // Aktifkan UUID otomatis

    protected $fillable = ['user_id', 'product_id', 'jumlah'];
}
