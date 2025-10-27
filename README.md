# 🧾 Lost & Found Portal — Backend

This backend handles the **database, file uploads**, and **API endpoints** for the Lost & Found web portal.
It uses **Node.js (Express.js)** for server handling and **MySQL** for data storage.

---

## 📁 Project Structure

```
project-root/
│
├── backend/
│   ├── server.js
│
├── public/               # Frontend files (HTML, CSS, JS)
├── uploads/              # Stores uploaded item images
└── README.md
```

---

## ⚙️ Tech Stack

| Component                 | Technology Used           |
| ------------------------- | ------------------------- |
| **Server**                | Node.js with Express.js   |
| **Database**              | MySQL                     |
| **File Uploads**          | Multer                    |
| **Security & Middleware** | CORS, Express JSON        |
| **Static File Serving**   | Express static middleware |

---

## 🗃️ Database Schema

**Database Name:** `lostfound`

Create it in MySQL using:

```sql
CREATE DATABASE lostfound;
USE lostfound;
```

### Table: `items`

| Column Name   | Data Type                         | Description                        |
| ------------- | --------------------------------- | ---------------------------------- |
| `id`          | INT (AUTO_INCREMENT, PRIMARY KEY) | Unique item ID                     |
| `name`        | VARCHAR(255)                      | Name of the lost/found item        |
| `description` | TEXT                              | Description of the item            |
| `image`       | VARCHAR(255)                      | File path to uploaded image        |
| `contact`     | VARCHAR(100)                      | Contact information of person      |
| `date`        | DATE                              | Date when item was lost/found      |
| `time`        | VARCHAR(20)                       | Time of loss/found                 |
| `location`    | VARCHAR(255)                      | Location where item was lost/found |
| `status`      | ENUM('lost', 'found')             | Whether the item was lost or found |

**SQL Script:**

```sql
CREATE TABLE items (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  description TEXT,
  image VARCHAR(255),
  contact VARCHAR(100),
  date DATE,
  time VARCHAR(20),
  location VARCHAR(255),
  status ENUM('lost', 'found') NOT NULL
);
```

---

## 🚀 Backend Setup Instructions

### 1. Install Dependencies

Navigate to your **backend** folder and run:

```bash
npm install express mysql2 cors multer path
```

### 2. Update Database Credentials

In `server.js`, update your MySQL credentials as per your local setup:

```js
const db = mysql.createConnection({
    host: "localhost",
    user: "app_user",
    password: "5657",
    database: "lostfound",
    port: 3306
});
```

> 💡 You can create a MySQL user using:
>
> ```sql
> CREATE USER 'app_user'@'localhost' IDENTIFIED BY '5657';
> GRANT ALL PRIVILEGES ON lostfound.* TO 'app_user'@'localhost';
> FLUSH PRIVILEGES;
> ```

### 3. Run the Server

Start the backend:

```bash
node server.js
```

You should see:

```
🚀 Server running on http://localhost:5500
```

---

## 🌐 API Endpoints

### 1️⃣ POST `/api/items`

Uploads an image and adds a new lost/found item.

**Request Type:** `multipart/form-data`

| Field         | Type                | Description              |
| ------------- | ------------------- | ------------------------ |
| `name`        | string              | Item name                |
| `description` | string              | Item description         |
| `contact`     | string              | Contact info             |
| `date`        | string (YYYY-MM-DD) | Date                     |
| `time`        | string              | Time                     |
| `location`    | string              | Location                 |
| `status`      | string              | Either `lost` or `found` |
| `image`       | file                | Uploaded image           |

**Example Response:**

```json
{
  "message": "✅ Item added successfully",
  "id": 7
}
```

---

### 2️⃣ GET `/api/items`

Fetches all lost/found items from the database.

**Response Example:**

```json
[
  {
    "id": 7,
    "name": "Wallet",
    "description": "Brown leather wallet near library",
    "image": "/uploads/1729994483211.jpg",
    "contact": "9876543210",
    "date": "2025-10-25",
    "time": "14:30",
    "location": "College Library",
    "status": "lost"
  }
]
```

---

## 🖼️ File Uploads

* Uploaded images are stored in the **`/uploads`** folder at the root level.
* Image URLs are accessible via:

  ```
  http://localhost:5500/uploads/<filename>
  ```

---

## ✅ Troubleshooting

| Issue                        | Cause                                   | Fix                                                                       |
| ---------------------------- | --------------------------------------- | ------------------------------------------------------------------------- |
| ❌ Uploaded image not visible | Wrong file path                         | Ensure `/uploads` folder exists in project root                           |
| ❌ Database insert error      | Invalid DB credentials or missing table | Check connection in `server.js` and re-run table creation script          |
| ❌ Static files not loading   | Wrong path                              | Verify `public` and `uploads` directory locations relative to `server.js` |

---

## 🧩 Example Project Flow

1. User submits a form (with image) → **Frontend (public/index.html)**
2. Request sent to → **`POST /api/items`**
3. Data + Image stored in → **MySQL + `/uploads` folder**
4. Display all items by fetching from → **`GET /api/items`**

---

## 📬 Author

**Sneha Sooraj**
📘 *B.Tech CSE Student, Saintgits College of Engineering*
💻 *Lost & Found Portal — Backend Integration*
