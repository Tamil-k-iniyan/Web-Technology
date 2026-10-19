const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");

const app = express();

app.use(cors());
app.use(express.json());

// Connect to MongoDB
mongoose.connect("mongodb://127.0.0.1:27017/studentdb")
    .then(() => console.log("MongoDB Connected"))
    .catch((err) => console.log("MongoDB Error:", err.message));

// Student schema
const studentSchema = new mongoose.Schema({
    regNo: { type: String, required: true },
    name: { type: String, required: true },
    department: { type: String, required: true },
    email: String,
    cgpa: Number
});

const Student = mongoose.model("Student", studentSchema);

// Test route
app.get("/", (req, res) => {
    res.send("Backend API is running");
});

// CREATE: Add a student
app.post("/students", async (req, res) => {
    try {
        const student = new Student(req.body);
        const savedStudent = await student.save();
        res.status(201).json(savedStudent);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// READ: Get all students
app.get("/students", async (req, res) => {
    try {
        const students = await Student.find();
        res.json(students);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// READ: Get one student
app.get("/students/:id", async (req, res) => {
    try {
        const student = await Student.findById(req.params.id);
        if (!student) {
        return res.status(404).json({ message: "Student not found" });
    }
        res.json(student);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

// UPDATE: Edit a student
app.put("/students/:id", async (req, res) => {
    try {
        const student = await Student.findByIdAndUpdate(
        req.params.id,
        req.body,
    { new: true, runValidators: true }
    );
    if (!student) {
        return res.status(404).json({ message: "Student not found" });
    }
        res.json(student);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

// DELETE: Remove a student
app.delete("/students/:id", async (req, res) => {
    try {
        const student = await Student.findByIdAndDelete(req.params.id);
        if (!student) {
        return res.status(404).json({ message: "Student not found" });
    }
        res.json({ message: "Student deleted successfully" });
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

app.listen(5000, () => {
    console.log("Server running on port 5000");
});
