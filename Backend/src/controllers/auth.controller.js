const userModel = require("../models/user.model");
const jsonwebtoken = require("jsonwebtoken");
const bcrypt = require("bcrypt");

// Cookie options — httpOnly prevents JS from reading the token (XSS protection)
// secure:true sends cookie only over HTTPS (set via NODE_ENV in production)
const cookieOptions = {
  httpOnly: true,                                  // not readable by JS
  secure: process.env.NODE_ENV === "production",   // HTTPS only in prod
  sameSite: process.env.NODE_ENV === "production" ? "none" : "lax", // cross-site in prod (frontend ≠ backend domain)
  maxAge: 60 * 60 * 1000,                         // 1 hour (matches JWT expiry)
};

async function registerUser(req, res) {
  try {
    const { username, email, password, role = "user" } = req.body;

    // Basic input validation
    if (!username || !email || !password) {
      return res.status(400).json({ message: "username, email and password are required" });
    }
    if (password.length < 6) {
      return res.status(400).json({ message: "Password must be at least 6 characters" });
    }

    // Check if the user already exists
    const existingUser = await userModel.findOne({ $or: [{ username }, { email }] });
    if (existingUser) {
      return res.status(409).json({ message: "User already exists" });
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = new userModel({ username, email, password: hashedPassword, role });
    await newUser.save();

    const token = jsonwebtoken.sign(
      { id: newUser._id, role: newUser.role },
      process.env.JWT_SECRET,
      { expiresIn: "1h" },
    );

    res.cookie("token", token, cookieOptions);

    res.status(201).json({
      message: "User registered successfully",
      user: {
        id: newUser._id,
        username: newUser.username,
        email: newUser.email,
        role: newUser.role,
      },
    });
  } catch (error) {
    console.error("Error registering user:", error);
    res.status(500).json({ message: "Internal server error" });
  }
}

async function loginUser(req, res) {
  try {
    const { username, email, password } = req.body;

    if (!password || (!username && !email)) {
      return res.status(400).json({ message: "Credentials are required" });
    }

    // Find by username OR email (supports login with either)
    const user = await userModel.findOne({ $or: [{ username }, { email }] });
    if (!user) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    const token = jsonwebtoken.sign(
      { id: user._id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: "1h" },
    );

    res.cookie("token", token, cookieOptions);

    res.status(200).json({
      message: "User logged in successfully",
      user: {
        id: user._id,
        username: user.username,
        email: user.email,
        role: user.role,
      },
    });
  } catch (error) {
    console.error("Error logging in user:", error);
    res.status(500).json({ message: "Internal server error" });
  }
}

async function logoutUser(req, res) {
  res.clearCookie("token", cookieOptions);
  res.status(200).json({ message: "User logged out successfully" });
}

module.exports = { registerUser, loginUser, logoutUser };
