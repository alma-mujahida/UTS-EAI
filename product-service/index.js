const express = require('express');
const mysql = require('mysql2');
const { v4: uuidv4 } = require('uuid');
const cors = require('cors');

const app = express();
app.use(express.json());
app.use(cors());

// 1. Koneksi ke Database db_product_service
const db = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '', 
    database: 'db_product_service'
});

db.connect((err) => {
    if (err) {
        console.error('Gagal koneksi database: ' + err.stack);
        return;
    }
    console.log('Terhubung ke Database Product Service!');
});

// 2. Endpoint untuk melihat semua produk (Provider - GET)
app.get('/products', (req, res) => {
    db.query('SELECT * FROM products', (err, results) => {
        if (err) return res.status(500).json(err);
        res.json(results);
    });
});

// 3. Endpoint untuk Menambah Produk Baru (Provider - POST)
app.post('/products', (req, res) => {
    const { nama, stok, harga } = req.body;
    const id = uuidv4(); // Generate UUID otomatis

    // Validasi input sederhana
    if (!nama || !stok || !harga) {
        return res.status(400).json({ message: "Nama, stok, dan harga harus diisi!" });
    }

    const query = 'INSERT INTO products (id, nama, stok, harga) VALUES (?, ?, ?, ?)';
    db.query(query, [id, nama, stok, harga], (err, result) => {
        if (err) return res.status(500).json(err);
        res.status(201).json({ 
            message: "Produk berhasil ditambahkan!", 
            product_id: id 
        });
    });
});

// 4. Endpoint untuk Menghapus Produk (Provider - DELETE)
app.delete('/products/:id', (req, res) => {
    const { id } = req.params;

    const query = 'DELETE FROM products WHERE id = ?';
    db.query(query, [id], (err, result) => {
        if (err) return res.status(500).json(err);
        if (result.affectedRows > 0) {
            res.json({ message: "Produk berhasil dihapus!" });
        } else {
            res.status(404).json({ message: "Produk tidak ditemukan!" });
        }
    });
});

// 5. Endpoint untuk mengurangi stok (Dipanggil oleh Order Service - PATCH)
app.patch('/products/:id/reduce-stock', (req, res) => {
    const { id } = req.params; 
    const { qty } = req.body;

    const query = 'UPDATE products SET stok = stok - ? WHERE id = ? AND stok >= ?';
    db.query(query, [qty, id, qty], (err, result) => {
        if (err) return res.status(500).json(err);
        if (result.affectedRows > 0) {
            res.json({ message: "Stok berhasil dikurangi di Product Service!" });
        } else {
            res.status(400).json({ message: "Gagal: Stok tidak cukup atau ID salah" });
        }
    });
});

// 6. Jalankan di Port 3000
app.listen(3000, () => {
    console.log("Product Service (Node.js) berjalan di http://localhost:3000");
});
