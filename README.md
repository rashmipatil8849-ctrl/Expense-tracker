# 💰 Bellcorp Expense Tracker

A full-stack Expense Management Application built using the MERN Stack (MongoDB, Express, React, Node.js).  
Users can securely manage transactions, track expenses, analyze spending patterns, and explore transaction history with advanced filtering and pagination.

---

## 🚀 Live Demo

🔗 Frontend: https://your-frontend-link.vercel.app  
🔗 Backend API: https://your-backend-link.onrender.com  

---

## 📌 Features

### 🔐 Authentication & Security
- User Registration (JWT based authentication)
- Secure Login
- Protected Routes
- Token-based Authorization (Bearer Token)
- Password encryption using bcrypt

---

### 💳 Transaction Management (CRUD)
- Add Transaction
- Edit Transaction
- Delete Transaction (with confirmation modal)
- View Transaction Details
- Transactions linked to authenticated user only

---

### 📊 Dashboard
- Total Expenses Summary
- Total Transactions Count
- Monthly Expense Summary
  - This Month
  - Last Month
  - Change Indicator
- Category-based Pie Chart Breakdown
- Recent Transactions Preview

---

### 🔎 Transaction Explorer
- Pagination (Scalable loading)
- Dynamic data fetching
- Search by title (case insensitive)
- Filter by:
  - Category
  - Date Range
  - Amount Range
- Sorting:
  - Newest First
  - Oldest First
  - Amount High → Low
  - Amount Low → High
- Reset Filters
- Empty state handling
- UI state persistence during navigation

---

## 🛠️ Tech Stack

### Frontend
- React.js
- React Router DOM
- Axios
- Recharts (for charts)
- Inline styling / custom UI

### Backend
- Node.js
- Express.js
- MongoDB Atlas
- Mongoose
- JWT Authentication
- bcrypt.js

---

## 🗂️ Project Structure

bellcorp-expense-tracker/
│
├── client/ # Frontend (React)
│ ├── src/
│ │ ├── components/
│ │ ├── pages/
│ │ ├── api.js
│ │ └── App.js
│ └── package.json
│
├── server/ # Backend (Node + Express)
│ ├── controllers/
│ ├── middleware/
│ ├── models/
│ ├── routes/
│ ├── config/
│ └── server.js
│
└── README.md 


---

## 🧩 Database Design

### User Schema

```js
{
  name: String,
  email: String,
  password: String (hashed)
}

Transaction Schema
{
  userId: ObjectId (ref: User),
  title: String,
  amount: Number,
  category: String,
  date: Date,
  notes: String,
  timestamps: true
}

Each transaction is linked to a specific user.

Secure multi-user architecture.

Optimized for filtering and pagination.

⚙️ Environment Variables
Backend (.env)
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_secret_key
PORT=5000

🧪 Installation & Setup (Local)
1️⃣ Clone Repository

git clone https://github.com/rashmipatil8849-ctrl/Expense-tracker
cd bellcorp-expense-tracker

2️⃣ Backend Setup
cd server
npm install
npm run dev

Server runs on:
http://localhost:5000

3️⃣ Frontend Setup
cd client
npm install
npm start

Frontend runs on:
http://localhost:3000

🔐 Authentication Flow

User registers

Server generates JWT

Token stored in localStorage

Axios interceptor attaches token to requests

Protected routes verify token using middleware

📈 Scalability Considerations

Pagination implemented in backend

Filtering done via MongoDB query optimization

Indexed by userId

No bulk loading of 1000+ transactions

Secure route protection middleware

⭐ Conclusion

This project demonstrates:

Full-stack MERN development

Authentication & Authorization

Scalable transaction handling

Clean UI/UX

Structured and maintainable codebase