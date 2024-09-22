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
const mongoURI = process.env.MONGODB_URI;

dotenv.config();

const app = express();
const port = process.env.PORT || 5000;

app.use(cors());
app.use(bodyParser.json());

// MongoDB connection
mongoose.connect("mongodb+srv://creatordiv:divya_131203@gecbook.lgqzy.mongodb.net/", {
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
