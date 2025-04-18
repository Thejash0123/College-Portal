const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const bodyParser = require('body-parser');

// Set up the app
const app = express();
const port = 5000;

// Middleware
app.use(cors());
app.use(bodyParser.json());

// Connect to MongoDB
mongoose.connect('mongodb://localhost:27017/school', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

// Define the Student Schema
const studentSchema = new mongoose.Schema({
  rollNo: { type: String, required: true, unique: true },
  name: { type: String, required: true },
  class: { type: String, required: true },
});
studentSchema.index({ rollNo: 1 }, { unique: true });

// Define the Attendance Schema
const attendanceSchema = new mongoose.Schema({
  rollNo: { type: String, required: true },
  name: { type: String, required: true },
  attendance: { type: String, required: true },
  date: { type: Date, default: Date.now },
});

// Define the Marks Schema
const marksSchema = new mongoose.Schema({
  rollNo: { type: String, required: true },
  name: { type: String, required: true },
  totalMarks: { type: Number, required: true },
  result: { type: String, required: true }, // "Pass" or "Fail"
});

// Create models
const Student = mongoose.model('Student', studentSchema);
const Attendance = mongoose.model('Attendance', attendanceSchema);
const Marks = mongoose.model('Marks', marksSchema);

Student.init(); // Ensure index is built

// ✅ Create a new student
app.post('/api/students', async (req, res) => {
  const { rollNo, name, class: studentClass } = req.body;

  try {
    const newStudent = new Student({
      rollNo,
      name,
      class: studentClass,
    });

    await newStudent.save();
    res.status(201).json({ message: 'Student added successfully', student: newStudent });
  } catch (err) {
    console.error(err);
    if (err.code === 11000) {
      res.status(409).json({ message: 'Student with this roll number already exists' });
    } else {
      res.status(500).json({ message: 'Error adding student' });
    }
  }
});

// ✅ Get student by roll number
app.get('/api/students/:rollNo', async (req, res) => {
  try {
    const rollNo = req.params.rollNo;
    const student = await Student.findOne({ rollNo });

    if (!student) {
      return res.status(404).json({ message: 'Student not found' });
    }

    res.json(student);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// ✅ Add attendance with check to see if attendance is already submitted
app.put('/api/students/:rollNo/attendance', async (req, res) => {
  const { attendance } = req.body;
  const rollNo = req.params.rollNo;

  try {
    // Find the student by roll number
    const student = await Student.findOne({ rollNo });

    if (!student) {
      return res.status(404).json({ message: 'Student not found' });
    }

    // Check if attendance has already been submitted for the student on this date
    const existingAttendance = await Attendance.findOne({
      rollNo,
      date: { $gte: new Date().setHours(0, 0, 0, 0) }, // Check if any attendance exists for today
    });

    if (existingAttendance) {
      return res.status(400).json({ message: 'Attendance is already submitted for today' });
    }

    // Create a new attendance record
    const attendanceRecord = new Attendance({
      rollNo,
      name: student.name,
      attendance,
    });

    // Save the attendance record
    await attendanceRecord.save();

    res.status(200).json({ message: 'Attendance saved successfully!', attendanceRecord });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Error saving attendance record' });
  }
});

// ✅ Add marks
app.put('/api/students/:rollNo/marks', async (req, res) => {
  const { totalMarks, result } = req.body;
  const rollNo = req.params.rollNo;

  try {
    const student = await Student.findOne({ rollNo });

    if (!student) {
      return res.status(404).json({ message: 'Student not found' });
    }

    const marksRecord = new Marks({
      rollNo,
      name: student.name,
      totalMarks,
      result,
    });

    await marksRecord.save();

    res.status(200).json({ message: 'Marks saved successfully!', marksRecord });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Error saving marks record' });
  }
});

// ✅ Get attendance
app.get('/api/attendance/:rollNo', async (req, res) => {
  const rollNo = req.params.rollNo;
  const { startDate, endDate, limit = 10, page = 1 } = req.query;

  try {
    let query = { rollNo };
    if (startDate && endDate) {
      query.date = { $gte: new Date(startDate), $lte: new Date(endDate) };
    }

    const skip = (page - 1) * limit;

    const records = await Attendance.find(query).skip(skip).limit(Number(limit));
    if (records.length === 0) {
      return res.status(404).json({ message: 'No attendance records found for this Roll Number.' });
    }

    const totalRecords = await Attendance.countDocuments(query);
    const totalPages = Math.ceil(totalRecords / limit);

    res.status(200).json({
      records,
      totalRecords,
      totalPages,
      currentPage: Number(page),
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Error fetching attendance records' });
  }
});

// ✅ Get marks (updated for correct result format)
app.get('/api/marks/:rollNo', async (req, res) => {
  try {
    const rollNo = req.params.rollNo;
    const record = await Marks.findOne({ rollNo });

    if (!record) {
      return res.status(404).json({ message: 'Marks not found for this Roll Number' });
    }

    const { name, totalMarks, result } = record;
    res.status(200).json({ name, totalMarks, result });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Error fetching marks' });
  }
});
// ✅ Add marks (with check for duplicate)
app.put('/api/students/:rollNo/marks', async (req, res) => {
  const { totalMarks, result } = req.body;
  const rollNo = req.params.rollNo;

  try {
    const student = await Student.findOne({ rollNo });

    if (!student) {
      return res.status(404).json({ message: 'Student not found' });
    }

    // Check if marks already exist for this roll number
    const existingMarks = await Marks.findOne({ rollNo });
    if (existingMarks) {
      return res.status(400).json({ message: 'Marks already updated for this student' });
    }

    const marksRecord = new Marks({
      rollNo,
      name: student.name,
      totalMarks,
      result,
    });

    await marksRecord.save();

    res.status(200).json({ message: 'Marks saved successfully!', marksRecord });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Error saving marks record' });
  }
});


// ✅ Login endpoint
app.post('/api/login', async (req, res) => {
  const { rollNo } = req.body;

  try {
    const student = await Student.findOne({ rollNo });

    if (!student) {
      return res.status(404).json({ message: 'Student not found' });
    }

    res.status(200).json({ message: 'Login successful', student });
  } catch (err) {
    res.status(500).json({ message: 'Error during login' });
  }
});

// Start server
app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});
