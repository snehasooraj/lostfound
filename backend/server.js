// server.js (inside the 'backend' folder)

const express = require("express");
const mysql = require("mysql2");
const cors = require("cors");
const multer = require("multer");
const path = require("path");

const app = express();
const PORT = process.env.PORT || 5500;

// --- Middleware Setup ---
app.use(cors());
app.use(express.json());

// --- Path Corrections ---
// Go UP one level (..) from 'backend' to the project root for these paths.

// 1. Serve static files from the 'public' directory
// This is the main fix. It finds 'repo/public'
app.use(express.static(path.join(__dirname, '../public')));

// 2. Serve static files from the 'uploads' directory
// Assuming 'uploads' is in the root (repo/uploads)
app.use("/uploads", express.static(path.join(__dirname, "../uploads")));

// --- Multer Storage Configuration ---
// Make sure multer also saves to the correct root 'uploads' folder
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        // Go UP one level to the root, then into 'uploads'
        cb(null, path.join(__dirname, "../uploads/"));
    },
    filename: (req, file, cb) =>
        cb(null, Date.now() + path.extname(file.originalname)),
});
const upload = multer({ storage });


// --- Database Connection ---
// (Your DB code is fine, no changes needed)
const db = mysql.createConnection({
    host: "localhost",
    user: "app_user",
    password: "5657",
    database: "lostfound",
    port: 3306
});
// (DB connect & table creation code is fine...)


// --- API Endpoints ---
// (Your API endpoints are fine, no changes needed)

// 1. POST: Insert new item
app.post("/api/items", upload.single("image"), (req, res) => {
    const { name, description, contact, date, time, location, status } = req.body;

    // This path is still correct, as the frontend will request it as '/uploads/filename.jpg'
    const image = req.file ? `/uploads/${req.file.filename}` : null;

    const sql =
        "INSERT INTO items (name, description, image, contact, date, time, location, status) VALUES (?,?,?,?,?,?,?,?)";

    db.query(
        sql,
        [name, description, image, contact, date, time, location, status],
        (err, result) => {
            if (err) {
                console.error("❌ Database Insert Error:", err.message);
                return res.status(500).json({ error: "Failed to insert item.", dbError: err.message });
            }
            res.json({ message: "✅ Item added successfully", id: result.insertId });
        }
    );
});

// 2. GET: Fetch all items
app.get("/api/items", (req, res) => {
    let sql = "SELECT * FROM items ORDER BY id DESC";
    db.query(sql, (err, results) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json(results);
    });
});

// Start server
app.listen(PORT, () => console.log(`🚀 Server running on http://localhost:${PORT}`));
