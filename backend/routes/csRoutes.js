// routes/csRoutes.js
const express = require('express');
const router = express.Router();
const Cs = require('../models/csSchema'); // Import the Cs model

// POST request to add a new record
router.post('/cs', async (req, res) => {
    try {
        const newRecord = new Cs(req.body); // Create a new record from request body
        await newRecord.save(); // Save to MongoDB
        res.status(201).json(newRecord); // Respond with created record data
    } catch (error) {
        console.error('Error creating record:', error);
        res.status(500).json({ message: 'Failed to create record', error });
    }
});

// GET request to retrieve all records
router.get('/cs', async (req, res) => {
    try {
        const records = await Cs.find(); // Retrieve all records from the DB
        res.status(200).json(records); // Respond with the list of records
    } catch (error) {
        console.error('Error fetching records:', error);
        res.status(500).json({ message: 'Failed to fetch records', error });
    }
});

// GET request to retrieve a single record by ID
router.get('/cs/:id', async (req, res) => {
    try {
        const record = await Cs.findById(req.params.id); // Find record by ID
        if (!record) {
            return res.status(404).json({ message: 'Record not found' });
        }
        res.status(200).json(record); // Respond with the found record
    } catch (error) {
        console.error('Error fetching record:', error);
        res.status(500).json({ message: 'Failed to fetch record', error });
    }
});

// DELETE request to remove a record by ID
router.delete('/cs/:id', async (req, res) => {
    try {
        const record = await Cs.findByIdAndDelete(req.params.id); // Delete record by ID
        if (!record) {
            return res.status(404).json({ message: 'Record not found' });
        }
        res.status(200).json({ message: 'Record deleted successfully' });
    } catch (error) {
        console.error('Error deleting record:', error);
        res.status(500).json({ message: 'Failed to delete record', error });
    }
});

// PUT request to update a record by ID
router.put('/cs/:id', async (req, res) => {
    try {
        const updatedRecord = await Cs.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
        if (!updatedRecord) {
            return res.status(404).json({ message: 'Record not found' });
        }
        res.status(200).json(updatedRecord);
    } catch (error) {
        console.error('Error updating record:', error);
        res.status(500).json({ message: 'Failed to update record', error });
    }
});

module.exports = router;
