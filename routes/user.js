const router = require("express").Router();
const User = require("../models/user");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

// SIGN UP API
router.post("/sign-up", async (req, res) => {
  try {
    const { username, email, password, country } = req.body;

    // Debug log (remove later in production)
    console.log("Signup Request Body:", req.body);

    // Check all fields
    if (!username || !email || !password || !country) {
      return res.status(400).json({ message: "All fields are required" });
    }

    if (typeof password !== "string" || password.trim() === "") {
      return res.status(400).json({ message: "Password must be a non-empty string" });
    }

    if (username.length < 4) {
      return res.status(400).json({ message: "Username should have at least 4 characters" });
    }

    const existingUser = await User.findOne({ username });
    if (existingUser) {
      return res.status(400).json({ message: "Username already exists" });
    }

    const existingEmail = await User.findOne({ email });
    if (existingEmail) {
      return res.status(400).json({ message: "Email already exists" });
    }

    // ✅ Hash password safely
    const hashPass = await bcrypt.hash(password, 10);

    const newUser = new User({
      username,
      email,
      password: hashPass,
      country,
    });

    await newUser.save();

    return res.status(200).json({ message: "Signup successful" });
  } catch (error) {
    console.error("Signup Error:", error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
});

// LOGIN API
router.post("/log-in", async (req, res) => {
  try {
    const { username, password } = req.body;

    // Debug log
    console.log("Login Request Body:", req.body);

    if (!username || !password) {
      return res.status(400).json({ message: "Username and password are required" });
    }

    const existingUser = await User.findOne({ username });
    if (!existingUser) {
      return res.status(400).json({ message: "Invalid Credentials" });
    }

    const isMatch = await bcrypt.compare(password, existingUser.password);
    if (!isMatch) {
      return res.status(400).json({ message: "Invalid Credentials" });
    }

    const token = jwt.sign(
      { id: existingUser._id, username: existingUser.username },
      "tcmTM",
      { expiresIn: "2d" }
    );

    return res.status(200).json({ id: existingUser._id, token });
  } catch (error) {
    console.error("Login Error:", error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
});

module.exports = router;
