// routes/timetable.js
const express = require('express');
const router = express.Router();
const Timetable = require('../models/Timetable');  // Adjust path as necessary

router.get('/:username/:day', async (req, res) => {
  const { username, day } = req.params;
  console.log(`Received request for username: ${username}, day: ${day}`);
  
  try {
    const timetable = await Timetable.find().exec();
    console.log('Querying for username:', username);
    console.log('Fetched Timetable:', timetable);
    
    if (timetable) {
      if (timetable[day]) {
        res.json(timetable[day]);
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

module.exports = router;
