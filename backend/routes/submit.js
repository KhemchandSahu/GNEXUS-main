const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const Attendance = require('../models/Attendance'); // Import your schema
const { parse } = require('json2csv');
const fs = require('fs');

// POST route to submit attendance
router.post('/attendance/submit/:teacherName', async (req, res) => {
  try {
    const { teacherName } = req.params;
    const { attendance } = req.body;

    // Use teacherName as collection name
    const AttendanceModel = mongoose.model(teacherName, Attendance.schema, teacherName);

    // Check if attendance for today already exists
    const existingRecord = await AttendanceModel.findOne({ date: new Date().toDateString() });

    if (existingRecord) {
      // If record for today exists, update it
      existingRecord.students = attendance;
      await existingRecord.save();
    } else {
      // If no record for today, create a new one
      const newAttendance = new AttendanceModel({
        date: new Date(),
        students: attendance,
      });
      await newAttendance.save();
    }

    const csv = parse(attendance);
    fs.writeFileSync('mainsheet.csv', csv);  
    res.status(200).json({ message: 'Attendance submitted successfully!' });
  } catch (error) {
    console.error('Error submitting attendance:', error);
    res.status(500).json({ message: 'Failed to submit attendance' });
  }
});

module.exports = router;
