// models/IT.js

const mongoose = require('mongoose');

const ITSchema = new mongoose.Schema({
    name: { type: String, required: true },
    rollNumber: { type: String, required: true, unique: true },
    // semester: { type: String, required: false},
    // class: { type: String, required: true },
    // subjects: [String], // Array of subjects,
    // Branch: { type: String, required:true}
    // classcode:{type: Number, required: false}
}, {
    timestamps: true
});

module.exports = mongoose.model('IT', ITSchema);
