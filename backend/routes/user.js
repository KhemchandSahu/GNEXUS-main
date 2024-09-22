const express = require('express');
const router = express.Router();
const User = require('../models/User');  // Adjust path if necessary
const Timetable = require('../models/Timetable');
const mongoose = require('mongoose');

// Old route: Get all users
router.route('/').get(async (req, res) => {
  try {
    const users = await User.find().exec();
    res.json(users);
  } catch (err) {
    res.status(400).json('Error: ' + err);
  } finally {
    mongoose.connection.close(() => {
      console.log('MongoDB connection closed after API call');
    });
  }
});

// Old route: Add a new user
router.route('/add').post(async (req, res) => {
  const { name, password, userType } = req.body;
  const newUser = new User({ name, password, userType });
  
  try {
    await newUser.save();
    res.json('User added!');
  } catch (err) {
    res.status(400).json('Error: ' + err);
  } finally {
    mongoose.connection.close(() => {
      console.log('MongoDB connection closed after API call');
    });
  }
});

// Old route: Fetch timetable for a specific user and day
router.get('/:username/:day', async (req, res) => {
  try {
    const { username, day } = req.params;
    const timetable = await Timetable.findOne({ userName: username }).exec();
    
    if (timetable && timetable.timetable && timetable.timetable[day]) {
      res.json(timetable.timetable[day]);
    } else {
      res.status(404).send("Not found");
    }
  } catch (error) {
    console.error(error);
    res.status(500).send("Server error");
  }
  // } finally {
  //   mongoose.connection.close(() => {
  //     console.log('MongoDB connection closed after API call');
  //   });
  // }
});

// New route: Create or update a user using upsert functionality
router.post('/users', async (req, res) => {
  const { userName, password, userType } = req.body;
  try {
    const user = await User.findOneAndUpdate(
      { userName },
      { password, userType },
      { new: true, upsert: true } // Upsert creates a new user if one doesn't exist
    ).exec();
    
    res.json(user);
  } catch (error) {
    console.error(error);
    res.status(500).send('Server error');
    
  // } finally {
  //   mongoose.connection.close(() => {
  //     console.log('MongoDB connection closed after API call');
  //   });
  }
});

module.exports = router;
