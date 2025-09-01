const express = require("express");
const app = express();
require("dotenv").config();
require("./conn/conn");
const cors = require("cors");

// Import routes
const UserAPI = require("./routes/user");
const TaskAPI = require("./routes/task");

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use("/api/v1", UserAPI); // user-related routes (signup, login)
app.use("/api/v2", TaskAPI); // task-related routes

// Test route
app.get("/", (req, res) => {
  res.send("Hello from backend side");
});

// ✅ Important: use process.env.PORT (for Vercel/Render)
const PORT = process.env.PORT || 1000;

app.listen(PORT, () => {
  console.log(`Server started on port ${PORT}`);
});
