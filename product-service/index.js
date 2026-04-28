const express = require('express');
const mysql = require('mysql2');
const { v4: uuidv4 } = require('uuid');
const cors = require('cors');

const app = express();
app.use(express.json());
app.use(cors());

// Koneksi ke Database db_product_service
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

// Endpoint untuk melihat semua produk (Provider)
app.get('/products', (req, res) => {
    db.query('SELECT * FROM products', (err, results) => {
        if (err) return res.status(500).json(err);
        res.json(results);
    });
});

// Endpoint untuk mengurangi stok (Dipanggil oleh Order Service)
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

// Jalankan di Port 3000
app.listen(3000, () => {
    console.log("Product Service (Node.js) berjalan di http://localhost:3000");
});

//update terakhir buat UTS