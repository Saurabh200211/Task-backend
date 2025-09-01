const mongoose = require("mongoose");

const TaskSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },
    desc: {
      type: String,
      required: true,
      trim: true,
    },
    important: {
      type: Boolean,
      default: false,
    },
    complete: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true, // ✅ auto add createdAt & updatedAt
  }
);

module.exports = mongoose.model("Task", TaskSchema);
