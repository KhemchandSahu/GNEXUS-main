const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const router = express.Router();


// Signup rpoute bana l;ete hai 
router.post('/signup', async (req, res) => {
    const { name, password, userType } = req.body;
    try {
        // Hash the password
        const hashedPassword = await bcrypt.hash(password, 10);
        
        // Create and save the new user
        const newUser = new User({ name, password: hashedPassword, userType });
        await newUser.save();

        // Generate JWT token
        const token = jwt.sign({ id: newUser._id }, 'secretKey');

        // Send user details along with the token
        res.status(201).json({
            token,
            name: newUser.name,
            userType: newUser.userType,
            _id: newUser._id,
            message: 'User created successfully'
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});


//Login bana leta hu guys
router.post('/login', async (req, res) => {
    const { name, password } = req.body;
    try {
        const user = await User.findOne({ name });
        if (!user) {
            return res.status(400).json({ message: 'User not found' });
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).json({ message: 'Invalid credentials' });
        }

        // Generate JWT token
        const token = jwt.sign({ id: user._id }, 'secretKey');

        // Send user details along with the token
        res.status(200).json({
            token,
            name: user.name, // Include name in the response
            userType: user.userType,
            _id: user._id // Include the user ID if needed
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});


module.exports = router;

