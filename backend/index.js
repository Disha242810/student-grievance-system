const express = require("express");
const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const cors = require("cors");
require("dotenv").config();

const app = express();

// Middleware
app.use(express.json());
app.use(cors());

// ENV
const PORT = process.env.PORT;
const MONGO_URI = process.env.MONGO_URI;
const JWT_SECRET = process.env.JWT_SECRET;

// DATABASE 
mongoose.connect(MONGO_URI)
  .then(() => console.log("MongoDB Connected"))
  .catch(err => console.log(err));

// SCHEMAS 
const studentSchema = new mongoose.Schema({
  name: String,
  email: { type: String, unique: true },
  password: String
});

const grievanceSchema = new mongoose.Schema({
  title: String,
  description: String,
  category: {
    type: String,
    enum: ["Academic", "Hostel", "Transport", "Other"]
  },
  date: { type: Date, default: Date.now },
  status: {
    type: String,
    enum: ["Pending", "Resolved"],
    default: "Pending"
  },
  studentId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Student"
  }
});

const Student = mongoose.model("Student", studentSchema);
const Grievance = mongoose.model("Grievance", grievanceSchema);

// AUTH MIDDLEWARE 
const authMiddleware = (req, res, next) => {
  const token = req.headers.authorization;

  if (!token) return res.status(401).json({ msg: "No token" });

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    req.user = decoded;
    next();
  } catch {
    res.status(401).json({ msg: "Invalid token" });
  }
};

//AUTH ROUTES

// REGISTER
app.post("/api/register", async (req, res) => {
  try {
    const { name, email, password } = req.body;

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = new Student({
      name,
      email,
      password: hashedPassword
    });

    await user.save();
    res.json({ msg: "User registered successfully" });

  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// LOGIN
app.post("/api/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await Student.findOne({ email });
    if (!user) return res.status(400).json({ msg: "User not found" });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ msg: "Invalid credentials" });

    const token = jwt.sign({ id: user._id }, JWT_SECRET, { expiresIn: "1d" });

    res.json({ token });

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// GRIEVANCE ROUTES

// CREATE
app.post("/api/grievances", authMiddleware, async (req, res) => {
  try {
    const grievance = new Grievance({
      ...req.body,
      studentId: req.user.id
    });

    await grievance.save();
    res.json(grievance);

  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// GET ALL
app.get("/api/grievances", authMiddleware, async (req, res) => {
  const grievances = await Grievance.find({ studentId: req.user.id });
  res.json(grievances);
});


// UPDATE
app.put("/api/grievances/:id", authMiddleware, async (req, res) => {
  const updated = await Grievance.findByIdAndUpdate(
    req.params.id,
    req.body,
    { new: true }
  );
  res.json(updated);
});

// DELETE
app.delete("/api/grievances/:id", authMiddleware, async (req, res) => {
  await Grievance.findByIdAndDelete(req.params.id);
  res.json({ msg: "Deleted successfully" });
});

// SEARCH
app.get("/api/grievances/search", authMiddleware, async (req, res) => {
  const { title } = req.query;

  const results = await Grievance.find({
    title: { $regex: title, $options: "i" },
    studentId: req.user.id
  });

  res.json(results);
});

app.get("/api/grievances/:id", authMiddleware, async (req, res) => {
  const grievance = await Grievance.findById(req.params.id);
  res.json(grievance);
});

// SERVER 
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});