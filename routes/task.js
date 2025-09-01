const router = require("express").Router();
const Task = require("../models/task");
const User = require("../models/user");
const {authenticateToken} = require("./auth");

// create-task
router.post("/create-task", authenticateToken, async (req, res) => {
    try {
        const { title, desc } = req.body;
        const { id } = req.headers;

        // ✅ Step 1: Check if a task with the same title already exists
        const existingTask = await Task.findOne({ title });
        if (existingTask) {
            return res.status(400).json({ message: "Task title already exists" });
        }

        // ✅ Step 2: Save the new task
        const newTask = new Task({ title, desc });
        const saveTask = await newTask.save();

        // ✅ Step 3: Add the task to the user
        await User.findByIdAndUpdate(id, { $push: { tasks: saveTask._id } });

        res.status(200).json({ message: "Task created successfully" });
    } catch (error) {
        console.log(error);
        res.status(400).json({ message: "Internal Server Error" });
    }
});

// get-all-tasks
router.get("/get-all-tasks", authenticateToken, async (req, res) => {
    try {
        const {id} = req.headers;
        const userData = await User.findById(id).populate({ 
        path:"tasks",
        options: { sort: { createdAt: -1}},
    });
      res.status(200).json({ data: userData });
    } catch (error) {
        console.log(error);
        res.status(400).json({ message: "Internal Server Error" });
    }
});

// delete-Task
router.delete("/delete-task/:id", authenticateToken, async (req, res) => {
    try {
        const {id} = req.params;
        const userId = req.headers.id;
        await Task.findByIdAndDelete(id);
        await User.findByIdAndUpdate(userId, { $pull: { tasks: id }});
      res.status(200).json({ message: "Task deleted successfully"});
    } catch (error) {
        console.log(error);
        res.status(400).json({ message: "Internal Server Error" });
    }
});

// update-Task
router.put("/update-task/:id", authenticateToken, async (req, res) => {
    try {
        const {id} = req.params;
        const {title, desc} = req.body;
        await Task.findByIdAndUpdate(id, {title: title, desc: desc });
      res.status(200).json({ message: "Task updated successfully"});
    } catch (error) {
        console.log(error);
        res.status(400).json({ message: "Internal Server Error" });
    }
});

// update-Important Task
router.put("/update-imp-task/:id", authenticateToken, async (req, res) => {
    try {
        const {id} = req.params;
        const TaskData = await Task.findById(id);
        const ImpTask = TaskData.important;
        await Task.findByIdAndUpdate(id, { important: !ImpTask });
      res.status(200).json({ message: "Task updated successfully"});
    } catch (error) {
        console.log(error);
        res.status(400).json({ message: "Internal Server Error" });
    }
});

// update-Complete Task
router.put("/update-complete-task/:id", authenticateToken, async (req, res) => {
    try {
        const {id} = req.params;
        const TaskData = await Task.findById(id);
        const CompleteTask = TaskData.complete;
        await Task.findByIdAndUpdate(id, { complete: !CompleteTask });
      res.status(200).json({ message: "Task updated successfully"});
    } catch (error) {
        console.log(error);
        res.status(400).json({ message: "Internal Server Error" });
    }
});

// get important tasks
router.get("/get-imp-tasks", authenticateToken, async (req, res) => {
    try {
        const {id} = req.headers;
        const Data = await User.findById(id).populate({
        path: "tasks",
        match: { important: true },
        options: { sort:  { createdAt: -1} },
        });
        const ImpTaskData = Data.tasks;
      res.status(200).json({ data: ImpTaskData });
    } catch (error) {
        console.log(error);
        res.status(400).json({ message: "Internal Server Error" });
    }
});

// get-complete-tasks
router.get("/get-complete-tasks", authenticateToken, async (req, res) => {
    try {
        const {id} = req.headers;
        const Data = await User.findById(id).populate({
        path: "tasks",
        match: { complete: true },
        options: { sort:  { createdAt: -1} },
        });
        const CompTaskData = Data.tasks;
      res.status(200).json({ data: CompTaskData });
    } catch (error) {
        console.log(error);
        res.status(400).json({ message: "Internal Server Error" });
    }
});

// get-incomplete-tasks
router.get("/get-incomplete-tasks", authenticateToken, async (req, res) => {
    try {
        const {id} = req.headers;
        const Data = await User.findById(id).populate({
        path: "tasks",
        match: { complete: false },
        options: { sort:  { createdAt: -1} },
        });
        const CompTaskData = Data.tasks;
      res.status(200).json({ data: CompTaskData });
    } catch (error) {
        console.log(error);
        res.status(400).json({ message: "Internal Server Error" });
    }
});
module.exports = router;
