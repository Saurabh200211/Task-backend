const router = require("express").Router();
const Task = require("../models/task");
const User = require("../models/user");
const { authenticateToken } = require("./auth");

// create-task
router.post("/create-task", authenticateToken, async (req, res) => {
  try {
    const { title, desc } = req.body;
    const { id } = req.headers;

    console.log("Create task request body:", req.body);

    if (!title) {
      return res.status(400).json({ message: "Title is required" });
    }

    const newTask = new Task({ title, desc });
    const saveTask = await newTask.save();

    await User.findByIdAndUpdate(id, { $push: { tasks: saveTask._id } });

    res.status(200).json({ message: "Task created successfully", task: saveTask });
  } catch (error) {
    console.error("Create task error:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
});

// get-all-tasks
router.get("/get-all-tasks", authenticateToken, async (req, res) => {
  try {
    const { id } = req.headers;
    const userData = await User.findById(id).populate({
      path: "tasks",
      options: { sort: { createdAt: -1 } },
    });
    res.status(200).json({ data: userData });
  } catch (error) {
    console.error("Get all tasks error:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
});

// delete-task
router.delete("/delete-task/:id", authenticateToken, async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.headers.id;
    await Task.findByIdAndDelete(id);
    await User.findByIdAndUpdate(userId, { $pull: { tasks: id } });
    res.status(200).json({ message: "Task deleted successfully" });
  } catch (error) {
    console.error("Delete task error:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
});

// update-task
router.put("/update-task/:id", authenticateToken, async (req, res) => {
  try {
    const { id } = req.params;
    const { title, desc } = req.body;

    if (!title) {
      return res.status(400).json({ message: "Title is required" });
    }

    await Task.findByIdAndUpdate(id, { title, desc });
    res.status(200).json({ message: "Task updated successfully" });
  } catch (error) {
    console.error("Update task error:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
});

// update-important
router.put("/update-imp-task/:id", authenticateToken, async (req, res) => {
  try {
    const { id } = req.params;
    const TaskData = await Task.findById(id);
    await Task.findByIdAndUpdate(id, { important: !TaskData.important });
    res.status(200).json({ message: "Task updated successfully" });
  } catch (error) {
    console.error("Update important task error:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
});

// update-complete
router.put("/update-complete-task/:id", authenticateToken, async (req, res) => {
  try {
    const { id } = req.params;
    const TaskData = await Task.findById(id);
    await Task.findByIdAndUpdate(id, { complete: !TaskData.complete });
    res.status(200).json({ message: "Task updated successfully" });
  } catch (error) {
    console.error("Update complete task error:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
});

// get important tasks
router.get("/get-imp-tasks", authenticateToken, async (req, res) => {
  try {
    const { id } = req.headers;
    const Data = await User.findById(id).populate({
      path: "tasks",
      match: { important: true },
      options: { sort: { createdAt: -1 } },
    });
    res.status(200).json({ data: Data.tasks });
  } catch (error) {
    console.error("Get important tasks error:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
});

// get-complete-tasks
router.get("/get-complete-tasks", authenticateToken, async (req, res) => {
  try {
    const { id } = req.headers;
    const Data = await User.findById(id).populate({
      path: "tasks",
      match: { complete: true },
      options: { sort: { createdAt: -1 } },
    });
    res.status(200).json({ data: Data.tasks });
  } catch (error) {
    console.error("Get complete tasks error:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
});

// get-incomplete-tasks
router.get("/get-incomplete-tasks", authenticateToken, async (req, res) => {
  try {
    const { id } = req.headers;
    const Data = await User.findById(id).populate({
      path: "tasks",
      match: { complete: false },
      options: { sort: { createdAt: -1 } },
    });
    res.status(200).json({ data: Data.tasks });
  } catch (error) {
    console.error("Get incomplete tasks error:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
});

module.exports = router;
