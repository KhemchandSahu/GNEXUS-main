const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const bodyParser = require('body-parser');
const dotenv = require('dotenv');
const studentRoutes = require('./routes/students');
const userRoutes = require('./routes/user')
const timetableRoutes = require('./routes/timetable')
const authRoutes = require('./routes/auth');
const usersRouter = require('./routes/user')
const Timetable = require('./models/Timetable');
const newSubmit = require('./routes/newSubmit')

dotenv.config();

const app = express();
const port = process.env.PORT || 5000;

app.use(cors());
app.use(bodyParser.json());

// MongoDB connection
mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/', {
    useNewUrlParser: true,
    useUnifiedTopology: true
}).then(() => console.log('MongoDB connected')).catch(err => console.log(err));

app.use('/api',userRoutes);
app.use('/api', timetableRoutes);
app.use('/api/auth', authRoutes);
app.use('/api',usersRouter);
app.use('/api', studentRoutes);
app.use('/api', newSubmit);

app.get('/timetable/:username/:day', async (req, res) => {
    try {
      const { username, day } = req.params;
      const timetable = await Timetable.findOne({ userName: username }).exec();
      console.log("Fetched Timetable:", timetable);
      console.log("Requested day:", day);
      if (timetable && timetable.timetable && timetable.timetable[day]) {
        res.json(timetable.timetable[day]);
      } else {
        res.status(404).send(`Day "${day}" not found for the user "${username}"`);
      }
    } catch (error) {
      console.error('Server error:', error);
      res.status(500).send("Server error");
    }
});

app.get('/api/test', (req, res) => {
    res.send('API is working!');
});
  
  
  // Error handling middleware
app.use((err, req, res, next) => {
   console.error(err.stack);
   res.status(500).send('Something broke!');
});
  
// Start the server
app.listen(port, () => {
  console.log(`Server is running on port: ${port}`);
});
  












// Import required modules
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const bodyParser = require('body-parser');
const dotenv = require('dotenv');
const studentRoutes = require('./routes/students');  // Add the students route
const csRoutes = require('./routes/csRoutes'); // Import the new cs routes
const newSubmit = require('./routes/newSubmit') // Import the new submit route

// Load environment variables
dotenv.config();

// Create an instance of Express
const app = express();
const port = process.env.PORT || 5000;

// Middleware setup
app.use(cors()); // Allow cross-origin requests
app.use(bodyParser.json()); // Parse JSON request bodies

// MongoDB connection
mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/', {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
  .then(() => console.log('MongoDB connected'))
  .catch(err => console.log(err));

// Models
const Timetable = require('./models/Timetable');

// Routes
const userRoutes = require('./routes/user');          // New user routes
const timetableRoutes = require('./routes/timetable'); // New timetable routes
const authRoutes = require('./routes/auth');           // Old auth routes
const usersRouter = require('./routes/user');         // Old user routes
// const savitaMamcsv = require('./routes/Savitamamcsv');
// const savitaMam = require('./routes/SavitaSmam')
// const submitRoutes = require('./routes/submit')

// Mount the routes
app.use('/api', userRoutes);                 // New user routes
app.use('/api', timetableRoutes);            // New timetable routes
app.use('/api/auth', authRoutes);            // Old auth routes
app.use('/users', usersRouter);              // Old user management routes
app.use('/api', studentRoutes);              // Using the new routes for students
app.use('/api', csRoutes);                   // Using the new routes for cs
// app.use('/api', savitaMam);
// app.use('/api', savitaMamcsv);
// app.use('/api', submitRoutes)
app.use('/api', newSubmit);

// Handle timetable fetching (old method preserved)
app.get('/timetable/:username/:day', async (req, res) => {
  try {
    const { username, day } = req.params;
    const timetable = await Timetable.findOne({ userName: username }).exec();
    console.log("Fetched Timetable:", timetable);
    console.log("Requested day:", day);
    if (timetable && timetable.timetable && timetable.timetable[day]) {
      res.json(timetable.timetable[day]);
    } else {
      res.status(404).send(`Day "${day}" not found for the user "${username}"`);
    }
  } catch (error) {
    console.error('Server error:', error);
    res.status(500).send("Server error");
  }
});

app.get('/api/test', (req, res) => {
  res.send('API is working!');
});


// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send('Something broke!');
});

// Start the server
app.listen(port, () => {
  console.log(`Server is running on port: ${port}`);
});


// const express = require('express');
// const mongoose = require('mongoose');
// const cors = require('cors');
// const bodyParser = require('body-parser');
// const dotenv = require('dotenv');
// const newSubmit = require('./routes/newSubmit'); // Import the new submit route

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

// // Test route
// app.post('/api/test', (req, res) => {
//   res.send('Test route received!');
// });

// app.listen(port, () => {
//   console.log(`Server is running on port: ${port}`);
// });
