// server.js

const express = require("express");
const mysql = require("mysql2");
const cors = require("cors");
const multer = require("multer");
const path = require("path");

const app = express();
// 🔥 FIX: Set the default PORT to 5500 to match the port the browser is currently accessing (127.0.0.1:5500)
const PORT = process.env.PORT || 5500; 

// --- Middleware Setup ---
app.use(cors());

// 1. Serve static files from the 'uploads' directory
app.use("/uploads", express.static(path.join(__dirname, "uploads"))); 

// 2. Serve all other static files (HTML, CSS, script.js)
// Assuming your index.html is in the root directory
app.use(express.static(path.join(__dirname)));
app.use(express.json());


// --- Multer Storage Configuration ---
// This saves files to the 'uploads/' folder with a unique timestamped name
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        // Ensure the 'uploads' directory exists and has write permissions
        cb(null, "uploads/");
    },
    filename: (req, file, cb) =>
        cb(null, Date.now() + path.extname(file.originalname))
});
const upload = multer({ storage });


// --- Database Connection ---
// IMPORTANT: Replace the placeholders below with your actual credentials.
const db = mysql.createConnection({
    host: "localhost",
    user: "app_user", 
    password: "5657",
    database: "lostfound",
    port: 3306
});

db.connect(err => {
    if (err) console.error("❌ DB Connection Error:", err.message);
    else console.log("✅ Connected to MySQL");
});

// Create table if missing (Optional, but good for setup)
db.query(`
    CREATE TABLE IF NOT EXISTS items (
        id INT AUTO_INCREMENT PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        description TEXT,
        image VARCHAR(255),
        contact VARCHAR(255) NOT NULL,
        date DATE NOT NULL,
        time TIME NOT NULL,
        location VARCHAR(255) NOT NULL,
        status ENUM('lost','found') NOT NULL
    )
`, err => {
    if (err) console.error("Table Creation Error:", err.message);
});


// --- API Endpoints ---

// 1. POST: Insert new item
// This endpoint now correctly listens on the same port the browser is using (5500).
app.post("/api/items", upload.single("image"), (req, res) => {
    
    // Data from the form (req.body)
    const { name, description, contact, date, time, location, status } = req.body;
    
    // Image path: starts with /uploads/ so the front-end can find it
    const image = req.file ? `/uploads/${req.file.filename}` : null;

    const sql =
        "INSERT INTO items (name, description, image, contact, date, time, location, status) VALUES (?,?,?,?,?,?,?,?)";

    db.query(
        sql,
        [name, description, image, contact, date, time, location, status],
        (err, result) => {
            if (err) {
                console.error("❌ Database Insert Error:", err.message);
                // Status 500 for database error
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