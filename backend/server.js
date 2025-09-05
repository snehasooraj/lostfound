const express = require("express");
const mysql = require("mysql2");
const cors = require("cors");
const multer = require("multer");
const path = require("path");

const app = express();

// Middleware
app.use(cors());
app.use("/uploads", express.static(path.join(__dirname, "uploads")));
app.use(express.json());

// Multer setup for file upload
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/");
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname));
  }
});
const upload = multer({ storage });

// MySQL connection (uses Railway environment variables)
const db = mysql.createConnection({
  host: process.env.MYSQLHOST || "localhost",
  user: process.env.MYSQLUSER || "root",
  password: process.env.MYSQLPASSWORD || "5657",
  database: process.env.MYSQLDATABASE || "lostfound",
  port: process.env.MYSQLPORT || 3306
});

db.connect(err => {
  if (err) {
    console.error("❌ DB connection failed:", err);
  } else {
    console.log("✅ Connected to MySQL");
  }
});

// Create table if not exists
db.query(`
  CREATE TABLE IF NOT EXISTS items (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    image VARCHAR(255),
    contact VARCHAR(255) NOT NULL,
    date DATE NOT NULL,
    location VARCHAR(255) NOT NULL,
    status ENUM('lost','found') NOT NULL
  )
`, (err) => {
  if (err) console.error("Error creating table:", err);
});

// Routes
app.get("/api/items", (req, res) => {
  db.query("SELECT * FROM items", (err, results) => {
    if (err) return res.status(500).json({ error: err });
    res.json(results);
  });
});

app.post("/api/items", upload.single("image"), (req, res) => {
  const { name, description, contact, date, location, status } = req.body;
  const image = req.file ? `/uploads/${req.file.filename}` : null;

  const sql = "INSERT INTO items (name, description, image, contact, date, location, status) VALUES (?,?,?,?,?,?,?)";
  db.query(sql, [name, description, image, contact, date, location, status], (err, result) => {
    if (err) return res.status(500).json({ error: err });
    res.json({ message: "Item added successfully!" });
  });
});

// Railway gives PORT automatically
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});
