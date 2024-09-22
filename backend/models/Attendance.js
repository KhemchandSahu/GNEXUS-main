const mongoose = require('mongoose');

const attendanceSchema = new mongoose.Schema({
  date: { type: Date, required: true },
  students: [{ studentId: String, status: String }],
  time: String
});

const Attendance = mongoose.model('Attendance', attendanceSchema);

module.exports = Attendance;
