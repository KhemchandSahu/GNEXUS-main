// routes/timetable.js
const express = require('express');
const router = express.Router();
const Timetable = require('../models/Timetable');  // Adjust path as necessary
const { default: mongoose } = require('mongoose');
// const mongoose = require('mongoose');

// Old timetable route: Fetch a timetable by username and day
router.get('/:username/:day', async (req, res) => {
  const { username, day } = req.params;
  console.log(`Received request for username: ${username}, day: ${day}`);
  
  try {
    // Use the new query method from the new backend
    const timetableDoc = await Timetable.findOne({ userName: username }).exec();
    console.log('Querying for username:', username);
    console.log('Fetched Timetable:', timetableDoc);
    
    if (timetableDoc) {
      // Look for the day in the user's timetable
      const daySchedule = timetableDoc.timetable[day];
      if (daySchedule) {
        res.json(daySchedule);
      } else {
        console.log(`Day "${day}" not found`);
        res.status(404).send(`Day "${day}" not found`);
      }
    } else {
      console.log(`User "${username}" not found`);
      res.status(404).send(`User "${username}" not found`);
    }
  } catch (error) {
    console.error('Server error:', error);
    res.status(500).send("Server error");
  }
});

// New route: Fetch timetable for a user and a specific day
router.get('/timetable/:username/:day', async (req, res) => {
  const { username, day } = req.params;
  console.log(`Received request for username: ${username}, day: ${day}`);

  try {
    const timetableDoc = await Timetable.findOne({ userName: username }).exec();
    if (timetableDoc) {
      const daySchedule = timetableDoc.timetable[day];
      if (daySchedule) {
        res.json(daySchedule);
      } else {
        res.status(404).send('Day not found');
      }
    } else {
      res.status(404).send('Username not found');
    }
  } catch (error) {
    console.error(error);
    res.status(500).send('Server error');
  }
});

// New route: Create or update a timetable
router.post('/timetable', async (req, res) => {
  const { userName, timetable } = req.body;
  try {
    const timetableDoc = await Timetable.findOneAndUpdate(
      { userName },
      { timetable },
      { new: true, upsert: true }  // upsert will create a new document if one does not exist
    );
    res.json(timetableDoc);
  } catch (error) {
    console.error(error);
    res.status(500).send('Server error');
  }
});

module.exports = router;
