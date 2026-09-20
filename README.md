# Student Portal REST API (Pure Backend)

This is a pure Node.js + Express + MongoDB REST API backend service for Student Registration and Record Management.

---

## 🚀 How to Run the Server

```bash
npm run dev
```

The server will start on: **`http://localhost:5000`**

---

## 📌 API Endpoints Overview

| Method | Endpoint | Description |
| :--- | :--- | :--- |
| `GET` | `/` | API Health Check & Endpoint Directory |
| `POST` | `/api/users/register` | Register a new student |
| `GET` | `/api/users` | Get all student records |
| `GET` | `/api/users?search=rahul` | Search students by name, rollNo, fatherName, or phone |
| `GET` | `/api/users/:id` | Get single student by MongoDB ID or Roll Number |
| `PUT` | `/api/users/:id` | Update student details by MongoDB ID |
| `DELETE` | `/api/users/:id` | Delete student by MongoDB ID |
| `GET` | `/api/users/stats` | Get total registered student count & server stats |

---

## 🧪 Testing with Postman / Thunder Client / cURL

### 1. Register a New Student
- **Method:** `POST`
- **URL:** `http://localhost:5000/api/users/register`
- **Headers:** `Content-Type: application/json`
- **Body (JSON):**
```json
{
  "name": "Amit Kumar",
  "fatherName": "Rajesh Kumar",
  "motherName": "Sunita Devi",
  "rollNo": "CS2026-105",
  "phoneNo": "9876543210",
  "address": "Boring Road, Patna, Bihar"
}
```

### 2. Get All Students
- **Method:** `GET`
- **URL:** `http://localhost:5000/api/users`

### 3. Search Students
- **Method:** `GET`
- **URL:** `http://localhost:5000/api/users?search=Patna`

### 4. Get Single Student by ID or Roll No
- **Method:** `GET`
- **URL:** `http://localhost:5000/api/users/CS2026-105`

### 5. Update Student Details
- **Method:** `PUT`
- **URL:** `http://localhost:5000/api/users/<STUDENT_MONGODB_ID>`
- **Headers:** `Content-Type: application/json`
- **Body (JSON):**
```json
{
  "name": "Amit Kumar Sharma",
  "address": "Kankarbagh, Patna, Bihar"
}
```

### 6. Delete a Student
- **Method:** `DELETE`
- **URL:** `http://localhost:5000/api/users/<STUDENT_MONGODB_ID>`

---

## 💻 cURL Example for Registration

```bash
curl -X POST http://localhost:5000/api/users/register \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Rohan Verma",
    "fatherName": "Suresh Verma",
    "motherName": "Meena Verma",
    "rollNo": "CS2026-106",
    "phoneNo": "9123456780",
    "address": "Ranchi, Jharkhand"
  }'
```
