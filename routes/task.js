const router = require("express").Router();
const Task = require("../models/task");
const User = require("../models/user");
const { authenticateToken } = require("./auth");

// create-task
router.post("/create-task", authenticateToken, async (req, res) => {
  try {
    const { title, desc } = req.body;
    const userId = req.user.id; // ✅ from token

    // check duplicate task for same user
    const existingTask = await Task.findOne({ title, user: userId });
    if (existingTask) {
      return res.status(400).json({ message: "Task title already exists" });
    }

    // create new task
    const newTask = new Task({ title, desc });
    const savedTask = await newTask.save();

    // push to user
    await User.findByIdAndUpdate(userId, { $push: { tasks: savedTask._id } });

    res.status(200).json({ message: "Task created successfully", task: savedTask });
  } catch (error) {
    console.error("Create Task Error:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
});

// get-all-tasks
router.get("/get-all-tasks", authenticateToken, async (req, res) => {
  try {
    const userId = req.user.id; // ✅ from token
    const userData = await User.findById(userId).populate({
      path: "tasks",
      options: { sort: { createdAt: -1 } },
    });

    res.status(200).json({ tasks: userData.tasks }); // ✅ send only tasks
  } catch (error) {
    console.error("Get All Tasks Error:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
});

// delete-task
router.delete("/delete-task/:id", authenticateToken, async (req, res) => {
  try {
    const taskId = req.params.id;
    const userId = req.user.id;

    await Task.findByIdAndDelete(taskId);
    await User.findByIdAndUpdate(userId, { $pull: { tasks: taskId } });

    res.status(200).json({ message: "Task deleted successfully" });
  } catch (error) {
    console.error("Delete Task Error:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
});

// update-task
router.put("/update-task/:id", authenticateToken, async (req, res) => {
  try {
    const { title, desc } = req.body;
    const taskId = req.params.id;

    await Task.findByIdAndUpdate(taskId, { title, desc });
    res.status(200).json({ message: "Task updated successfully" });
  } catch (error) {
    console.error("Update Task Error:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
});

// toggle important
router.put("/update-imp-task/:id", authenticateToken, async (req, res) => {
  try {
    const taskId = req.params.id;
    const task = await Task.findById(taskId);
    task.important = !task.important;
    await task.save();

    res.status(200).json({ message: "Task importance updated" });
  } catch (error) {
    console.error("Update Important Error:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
});

// toggle complete
router.put("/update-complete-task/:id", authenticateToken, async (req, res) => {
  try {
    const taskId = req.params.id;
    const task = await Task.findById(taskId);
    task.complete = !task.complete;
    await task.save();

    res.status(200).json({ message: "Task completion updated" });
  } catch (error) {
    console.error("Update Complete Error:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
});

// get important tasks
router.get("/get-imp-tasks", authenticateToken, async (req, res) => {
  try {
    const userId = req.user.id;
    const data = await User.findById(userId).populate({
      path: "tasks",
      match: { important: true },
      options: { sort: { createdAt: -1 } },
    });

    res.status(200).json({ tasks: data.tasks });
  } catch (error) {
    console.error("Get Important Tasks Error:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
});

// get complete tasks
router.get("/get-complete-tasks", authenticateToken, async (req, res) => {
  try {
    const userId = req.user.id;
    const data = await User.findById(userId).populate({
      path: "tasks",
      match: { complete: true },
      options: { sort: { createdAt: -1 } },
    });

    res.status(200).json({ tasks: data.tasks });
  } catch (error) {
    console.error("Get Complete Tasks Error:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
});

// get incomplete tasks
router.get("/get-incomplete-tasks", authenticateToken, async (req, res) => {
  try {
    const userId = req.user.id;
    const data = await User.findById(userId).populate({
      path: "tasks",
      match: { complete: false },
      options: { sort: { createdAt: -1 } },
    });

    res.status(200).json({ tasks: data.tasks });
  } catch (error) {
    console.error("Get Incomplete Tasks Error:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
});

module.exports = router;
