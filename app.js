const express = require("express");
const app = express();
require("dotenv").config();
require("./conn/conn");
const cors = require("cors");

const UserAPI = require("./routes/user");
const TaskAPI = require("./routes/task");

// CORS setup
app.use(cors({
  origin: ["https://your-frontend.vercel.app"], // change to your frontend domain
  credentials: true
}));

app.use(express.json());

// Routes
app.use("/api/v1", UserAPI);  // signup, login, user routes
app.use("/api/v2", TaskAPI);  // task-related routes

// Root test route
app.use("/", (req, res) => {
  res.send("Hello from backend side");
});

// Dynamic port for deployment
const PORT = process.env.PORT || 1000;

app.listen(PORT, () => {
  console.log(`Server started on port ${PORT}`);
});
