const express = require('express');
const mysql = require('mysql2');
const cors = require('cors');
const { v4: uuidv4 } = require('uuid'); // Library untuk generate ID user otomatis

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
        process.exit(1);
    }
    console.log("Terhubung ke database MySQL (User Service)!");
});

// 1. ENDPOINT: REGISTER USER BARU
app.post('/register', (req, res) => {
    const { nama, email, password } = req.body;

    // --- TAMBAHAN: VALIDASI JIKA DATA KOSONG ---
    if (!nama || !email || !password) {
        return res.status(400).json({ 
            status: "Failed", 
            message: "Pendaftaran gagal: Nama, Email, dan Password wajib diisi!" 
        });
    }

    const id = uuidv4(); // Buat UUID otomatis

    const query = 'INSERT INTO users (id, nama, email, password) VALUES (?, ?, ?, ?)';
    db.query(query, [id, nama, email, password], (err, result) => {
        if (err) {
            // GAGAL karena email sudah ada di database
            if (err.code === 'ER_DUP_ENTRY') {
                return res.status(400).json({ 
                    status: "Failed", 
                    message: "Pendaftaran gagal: Email sudah terdaftar!" 
                });
            }
            // GAGAL karena masalah teknis lainnya
            return res.status(500).json({
                status: "Error",
                message: "Terjadi kesalahan pada server",
                error: err.message
            });
        }

        // BERHASIL
        res.status(201).json({ 
            status: "Success", 
            message: "User berhasil didaftarkan!",
            user_id: id 
        });
    });
});

// 2. ENDPOINT: LIHAT SEMUA USER (List All Users)
app.get('/users', (req, res) => {
    // Kita ambil id, nama, dan email saja (password tidak perlu ditampilkan demi keamanan)
    const query = 'SELECT id, nama, email FROM users';
    
    db.query(query, (err, results) => {
        if (err) {
            return res.status(500).json({
                status: "Error",
                message: "Gagal mengambil data user",
                error: err.message
            });
        }
        res.json({
            status: "Success",
            total: results.length,
            data: results
        });
    });
});


// 3. ENDPOINT: CEK USER BY ID (Lama - Masih dipakai Laravel Order)
app.get('/users/:id', (req, res) => {
    const { id } = req.params;
    db.query('SELECT id, nama, email FROM users WHERE id = ?', [id], (err, results) => {
        if (err) return res.status(500).json(err);
        if (results.length > 0) {
            res.json({ status: "Found", user: results[0] });
        } else {
            res.status(404).json({ status: "Not Found", message: "User tidak terdaftar!" });
        }
    });
});

// Jalankan di Port 4000
app.listen(4000, () => {
    console.log("User Service aktif di http://localhost:4000");
}).on('error', (err) => {
    console.error("Gagal menjalankan server: " + err.message);
});