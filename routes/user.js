const router = require("express").Router();
const User = require("../models/user");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

// SIGN UP API
router.post("/sign-up", async (req, res) => {
  try {
    const { username, email, password, country } = req.body;

    if (!username || !email || !password || !country) {
      return res.status(400).json({ message: "All fields are required" });
    }

    if (username.length < 4) {
      return res.status(400).json({ message: "Username should have at least 4 characters" });
    }

    const existingUser = await User.findOne({ username });
    if (existingUser) return res.status(400).json({ message: "Username already exists" });

    const existingEmail = await User.findOne({ email });
    if (existingEmail) return res.status(400).json({ message: "Email already exists" });

    const hashPass = await bcrypt.hash(password, 10);

    const newUser = new User({ username, email, password: hashPass, country });
    await newUser.save();

    return res.status(200).json({ message: "Signup successful" });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
});

// LOGIN API (corrected to /sign-in)
router.post("/sign-in", async (req, res) => {
  try {
    const { username, password } = req.body;

    const existingUser = await User.findOne({ username });
    if (!existingUser) return res.status(400).json({ message: "Invalid Credentials" });

    const isMatch = await bcrypt.compare(password, existingUser.password);
    if (!isMatch) return res.status(400).json({ message: "Invalid Credentials" });

    const token = jwt.sign({ id: existingUser._id, username }, "tcmTM", { expiresIn: "2d" });

    // Send token AND message
    return res.status(200).json({ 
      message: "Login successful",
      id: existingUser._id, 
      token 
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
});

module.exports = router;
