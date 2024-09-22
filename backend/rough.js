const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const app = express();
const port = process.env.PORT || 5000;

// Middleware setup
app.use(cors()); // Allow cross-origin requests
app.use(express.json()); // Parse JSON request bodies


const Timetable = require('./models/Timetable');
// Routes
const usersRouter = require('./routes/user');
app.use('/users', usersRouter);

const authRoutes = require('./routes/auth');
app.use('/api/auth', authRoutes);

const timetableroutes = require('./routes/timetable');
app.use('/timetable', timetableroutes)

const uri = "mongodb://localhost:27017/" // Replace with your MongoDB URI
mongoose.connect(uri, { useNewUrlParser: true, useUnifiedTopology: true });

const connection = mongoose.connection;
connection.once('open', () => {
  console.log("MongoDB database connection established successfully");
});

// const timetableRouter = require('./routes/timetable');
// app.use('/timetable', timetableRouter)

// app.get('/timetable/:username/:day', async (req, res) => {
//   try {
//     const { username, day } = req.params;
//     const timetable = await Timetable.findOne({ userName: username }).exec();
//     console.log("Fetched Timetable:", timetable);
//     console.log("requested day", day)
//     if (timetable) {
//       console.log("Enter the if block")
//       if(timetable[day]) {
//         res.join(timetable[day]);
//       }else{
//         res.status(404).send(`Day "${day}" not found on the username "${username}"`);
//       }
//     } else {
//       res.status(404).send("Not found");
//     }
//   } catch (error) {
//     console.error(error);
//     res.status(500).send("Server error");
//   }
// });
const timetableRouter = require('./routes/timetable')
app.use('/timetable', timetableRouter);
// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send('Something broke!');
});




// const timetableData = {
//   "SavitaSahu":{
//     "Monday":{
//       "10:30-11:30":"5th sem cs",
//       "11:30-12:30": "1st year pmps",
//       "12:30-1:30": "none",
//       "2:15-3:15": "3rd sem cs",
//       "3:15-5:15": "Lab 1st year"
//     }
//   }
// };

// app.get('/timetable/:username/:day', (req, res) => {
//   const { username, day} = req.params;
//   if (timetableData[username] && timetableData[username][day]){
//     res.json(timetableData[username][day]);
//   } else{
//     res.status(404).send("not found");
//   }
// })

app.listen(port, () => {
  console.log(`Server is running on port: ${port}`);
});


//server.js

// const express = require('express');
// const mongoose = require('mongoose');
// const cors = require('cors');
// const bodyParser = require('body-parser');
// const dotenv = require('dotenv');
// const newSubmit = require('./routes/newSubmit'); // Import the new submit route
// const csRoutes = require('./routes/csRoutes');
// const studentRoutes = require('./routes/students');
// const userRoutes = require('./routes/user');          // New user routes
// const timetableRoutes = require('./routes/timetable'); // New timetable routes
// const authRoutes = require('./routes/auth');           // Old auth routes
// const usersRouter = require('./routes/user');
// dotenv.config();

// const app = express();
// const port = process.env.PORT || 5000;

// app.use(cors()); // Enable CORS
// app.use(bodyParser.json()); // Parse JSON request bodies

// // Connect to MongoDB
// mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/', {
//   useNewUrlParser: true,
//   useUnifiedTopology: true
// })
//   .then(() => console.log('MongoDB connected'))
//   .catch(err => console.log(err));

// // Use the new submit route
// app.use('/api', newSubmit);
// app.use('/api', userRoutes);                 // New user routes
// app.use('/api', timetableRoutes);            // New timetable routes
// app.use('/api/auth', authRoutes);            // Old auth routes
// app.use('/users', usersRouter);              // Old user management routes
// app.use('/api', studentRoutes);              // Using the new routes for students
// app.use('/api', csRoutes);

// // Handle timetable fetching (old method preserved)
// app.get('/timetable/:username/:day', async (req, res) => {
//   try {
//     const { username, day } = req.params;
//     const timetable = await Timetable.findOne({ userName: username }).exec();
//     console.log("Fetched Timetable:", timetable);
//     console.log("Requested day:", day);
//     if (timetable && timetable.timetable && timetable.timetable[day]) {
//       res.json(timetable.timetable[day]);
//     } else {
//       res.status(404).send(`Day "${day}" not found for the user "${username}"`);
//     }
//   } catch (error) {
//     console.error('Server error:', error);
//     res.status(500).send("Server error");
//   }
// });

// app.get('/api/test', (req, res) => {
//   res.send('API is working!');
// });


// // Error handling middleware
// app.use((err, req, res, next) => {
//   console.error(err.stack);
//   res.status(500).send('Something broke!');
// });


// // Test route
// app.post('/api/test', (req, res) => {
//   res.send('Test route received!');
// });

// app.listen(port, () => {
//   console.log(`Server is running on port: ${port}`);
// });
