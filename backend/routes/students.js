const express = require('express');
const router = express.Router();
const CS = require('../models/cs'); // Import the CS model
const IT = require('../models/It');
const CSIT = require('../models/csandit');
const mongoose = require('mongoose');

// POST request to add a new student
router.post('/cs', async (req, res) => {
    try {
        const newStudent = new CS(req.body); // Create a new student from request body
        await newStudent.save(); // Save to MongoDB
        res.status(201).json(newStudent); // Respond with created student data
    } catch (error) {
        console.error('Error creating student:', error);
        res.status(500).json({ message: 'Failed to create student', error });
    }
});

router.post('/it', async (req, res) => {
    try {
        const newStudent = new IT(req.body); // Create a new student from request body
        await newStudent.save(); // Save to MongoDB
        res.status(201).json(newStudent); // Respond with created student data
    } catch (error) {
        console.error('Error creating student:', error);
        res.status(500).json({ message: 'Failed to create student', error });
    }
});

router.post('/both', async (req, res) => {
    try {
        const newStudent = new CSIT(req.body); // Create a new student from request body
        await newStudent.save(); // Save to MongoDB
        res.status(201).json(newStudent); // Respond with created student data
    } catch (error) {
        console.error('Error creating student:', error);
        res.status(500).json({ message: 'Failed to create student', error });
    }
});

// GET request to retrieve all students
router.get('/cs', async (req, res) => {
    try {
        const students = await CS.find(); // Retrieve all students from the DB
        console.log("India is beautiful getting the students detail")
        res.status(200).json(students); // Respond with the list of students
    } catch (error) {
        console.error('Error fetching students:', error);
        res.status(500).json({ message: 'Failed to fetch students', error });
    }
    // }finally{
    //     mongoose.disconnect();
    //     console.log('Mongoose connection closed');
    // }
});

router.get('/it', async (req, res) => {
    try {
        const students = await IT.find(); // Retrieve all students from the DB
        res.status(200).json(students); // Respond with the list of students
    } catch (error) {
        console.error('Error fetching students:', error);
        res.status(500).json({ message: 'Failed to fetch students', error });
    }
});

router.get('/both', async (req, res) => {
    try {
        const students = await CSIT.find(); // Retrieve all students from the DB
        console.log("India is beautiful getting the students detail")
        res.status(200).json(students); // Respond with the list of students
    } catch (error) {
        console.error('Error fetching students:', error);
        res.status(500).json({ message: 'Failed to fetch students', error });
    }
    // }finally{
    //     mongoose.disconnect();
    //     console.log('Mongoose connection closed');
    // }
});

// GET request to retrieve a single student by ID
router.get('/cs/:id', async (req, res) => {
    try {
        const student = await CS.findById(req.params.id); // Find student by ID
        if (!student) {
            return res.status(404).json({ message: 'Student not found' });
        }
        res.status(200).json(student); // Respond with the found student
    } catch (error) {
        console.error('Error fetching student:', error);
        res.status(500).json({ message: 'Failed to fetch student', error });
    }
});

router.get('/it/:id', async (req, res) => {
    try {
        const student = await IT.findById(req.params.id); // Find student by ID
        if (!student) {
            return res.status(404).json({ message: 'Student not found' });
        }
        res.status(200).json(student); // Respond with the found student
    } catch (error) {
        console.error('Error fetching student:', error);
        res.status(500).json({ message: 'Failed to fetch student', error });
    }
});

router.get('/both/:id', async (req, res) => {
    try {
        const student = await CSIT.findById(req.params.id); // Find student by ID
        if (!student) {
            return res.status(404).json({ message: 'Student not found' });
        }
        res.status(200).json(student); // Respond with the found student
    } catch (error) {
        console.error('Error fetching student:', error);
        res.status(500).json({ message: 'Failed to fetch student', error });
    }
});

// DELETE request to remove a student by ID
router.delete('/cs/:id', async (req, res) => {
    try {
        const student = await CS.findByIdAndDelete(req.params.id); // Delete student by ID
        if (!student) {
            return res.status(404).json({ message: 'Student not found' });
        }
        res.status(200).json({ message: 'Student deleted successfully' });
    } catch (error) {
        console.error('Error deleting student:', error);
        res.status(500).json({ message: 'Failed to delete student', error });
    }
});

router.delete('/it/:id', async (req, res) => {
    try {
        const student = await IT.findByIdAndDelete(req.params.id); // Delete student by ID
        if (!student) {
            return res.status(404).json({ message: 'Student not found' });
        }
        res.status(200).json({ message: 'Student deleted successfully' });
    } catch (error) {
        console.error('Error deleting student:', error);
        res.status(500).json({ message: 'Failed to delete student', error });
    }
});

router.delete('/both/:id', async (req, res) => {
    try {
        const student = await CSIT.findByIdAndDelete(req.params.id); // Delete student by ID
        if (!student) {
            return res.status(404).json({ message: 'Student not found' });
        }
        res.status(200).json({ message: 'Student deleted successfully' });
    } catch (error) {
        console.error('Error deleting student:', error);
        res.status(500).json({ message: 'Failed to delete student', error });
    }
});

// PUT request to update a student by ID
router.put('/cs/:id', async (req, res) => {
    try {
        const updatedStudent = await CS.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
        if (!updatedStudent) {
            return res.status(404).json({ message: 'Student not found' });
        }
        res.status(200).json(updatedStudent);
    } catch (error) {
        console.error('Error updating student:', error);
        res.status(500).json({ message: 'Failed to update student', error });
    }
});

router.put('/it/:id', async (req, res) => {
    try {
        const updatedStudent = await IT.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
        if (!updatedStudent) {
            return res.status(404).json({ message: 'Student not found' });
        }
        res.status(200).json(updatedStudent);
    } catch (error) {
        console.error('Error updating student:', error);
        res.status(500).json({ message: 'Failed to update student', error });
    }
});

router.put('/both/:id', async (req, res) => {
    try {
        const updatedStudent = await CSIT.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
        if (!updatedStudent) {
            return res.status(404).json({ message: 'Student not found' });
        }
        res.status(200).json(updatedStudent);
    } catch (error) {
        console.error('Error updating student:', error);
        res.status(500).json({ message: 'Failed to update student', error });
    }
});


module.exports = router;
