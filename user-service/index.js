const express = require('express');
const mysql = require('mysql2');
const cors = require('cors');

const app = express();
app.use(express.json());
app.use(cors());

// Koneksi ke Database User
const db = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'db_user_service'
});

// CEK KONEKSI DATABASE
db.connect((err) => {
    if (err) {
        console.error("Gagal koneksi ke database db_user_service: " + err.message);
        process.exit(1); // Berhenti jika DB tidak konek
    }
    console.log("Terhubung ke database MySQL!");
});

// Endpoint untuk cek apakah User ID valid
app.get('/users/:id', (req, res) => {
    const { id } = req.params;
    db.query('SELECT * FROM users WHERE id = ?', [id], (err, results) => {
        if (err) return res.status(500).json(err);
        if (results.length > 0) {
            res.json({ status: "Found", user: results[0] });
        } else {
            res.status(404).json({ status: "Not Found", message: "User tidak terdaftar!" });
        }
    });
});


app.listen(4000, () => {
    console.log("User Service aktif di http://localhost:4000");
}).on('error', (err) => {
    console.error("Gagal menjalankan server: " + err.message);
});