const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const TimetableSchema = new Schema({
  userName: { type: String, required: true, unique: true },
  timetable: {
    Monday: Map,
    Tuesday: Map,
    Wednesday: Map,
    Thursday: Map,
    Friday: Map,
    Saturday: Map,
    Sunday: Map
  }
}, { timestamps: true });

module.exports = mongoose.model('Timetable', TimetableSchema);