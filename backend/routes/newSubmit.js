const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const multer = require('multer');
const csv = require('csv-parser');
const { parse } = require('json2csv');
const fs = require('fs');
const path = require('path');
// const { type } = require('os');

// Setup multer for file upload
const upload = multer({ dest: 'uploads/' });

// Define the schema for attendance
const attendanceSchema = new mongoose.Schema({
  date: String,
  time : {type: String, require: true},
  students: [
    {
      name: String,
      isPresent: Boolean,
    },
  ],
});

// Create a model for Attendance based on teacherName
const getAttendanceModel = (teacherName) =>
  mongoose.model(teacherName + 'Attendance', attendanceSchema);

router.post('/attendance/submit/:teacherName', upload.single('file'), async (req, res) => {
  const { teacherName } = req.params;
  const { attendance } = req.body;

  // const today = new Date().toISOString().split('T')[0]; // Already used for the date
  const currentTime = new Date().toLocaleTimeString(); // Capture the current time


  const Attendance = getAttendanceModel(teacherName);

  try {
    const today = new Date().toISOString().split('T')[0];

    if (req.file) {
      // Handle CSV file upload and update
      const filePath = req.file.path;
      const updatedData = [];

      fs.createReadStream(filePath)
        .pipe(csv())
        .on('data', (row) => updatedData.push(row))
        .on('end', async () => {
          try {
            // Create a new attendance record from the uploaded CSV data
            await Attendance.create({
              date: today,
              time: currentTime,
              students: updatedData
            });
            fs.unlinkSync(filePath);
            res.status(200).json({ message: 'Data added successfully' });
          } catch (error) {
            console.error('Error adding data:', error);
            res.status(500).json({ message: 'Failed to add data' });
          }
        });
    } else {
      // Create a new attendance record
      await Attendance.create({
        date: today,
        time: currentTime,
        students: attendance
      });

      // Fetch all attendance records
      const allAttendance = await Attendance.find({});

      // Prepare data for CSV
      const headers = ['Name'];
      const dates = allAttendance.map((record) => record.date);
      headers.push(...dates, 'Total Classes', 'Classes Attended', 'Percentage of Attendance', 'Classes Absent');

      // Get unique student names
      const studentsMap = new Map();
      allAttendance.forEach((record) => {
        record.students.forEach((student) => {
          if (!studentsMap.has(student.name)) {
            studentsMap.set(student.name, []);
          }
          studentsMap.get(student.name).push({
            date: record.date,
            isPresent: student.isPresent,
          });
        });
      });

      // Create rows for each student
      const csvData = [];
      studentsMap.forEach((attendances, name) => {
        const row = { Name: name };
        let totalClasses = dates.length;
        let attendedClasses = 0;

        // Fill attendance data for each date
        dates.forEach((date) => {
          const attendanceRecord = attendances.find((a) => a.date === date);
          if (attendanceRecord && attendanceRecord.isPresent) {
            row[date] = 'P';
            attendedClasses++;
          } else {
            row[date] = 'A';
          }
        });

        // Add total classes, attended classes, and attendance percentage
        const percentage = ((attendedClasses / totalClasses) * 100).toFixed(2);
        row['Total Classes'] = totalClasses;
        row['Classes Attended'] = attendedClasses;
        row['Classes Absent'] = totalClasses - attendedClasses;
        row['Percentage of Attendance'] = `${percentage}%`;

        csvData.push(row);
      });

      // Convert JSON data to CSV
      const csvFilePath = path.join(__dirname, 'attendance.csv');
      const csvString = parse(csvData, { fields: headers });

      // Write the CSV file
      fs.writeFileSync(csvFilePath, csvString);

      // Send the CSV file to the client
      res.download(csvFilePath, 'attendance.csv', (err) => {
        if (err) {
          console.error('Error downloading file:', err);
          res.status(500).json({ message: 'Error downloading file' });
        }
        try {
          fs.unlinkSync(csvFilePath); // Clean up temp file
        } catch (cleanupError) {
          console.error('Error cleaning up CSV file:', cleanupError);
        }
      });
    }
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// const upload = multer({dest: 'uploads/'});

router.post('/attendance/upload/:teacherName', upload.single('file'), async (req, res) => {
  const {teacherName} = req.params

  const Attendance = getAttendanceModel(teacherName);

  try{
    if(req.file){
      const filePath = req.file.path;
      const updateData = [];

      const today = new Date().toISOString().split('T')[0];

      fs.createReadStream(filePath).pipe(csv()).on('data', (row) =>{
        const student = {
          name: row['Name'],
          isPresent: row[today] === 'P',
        };
        updateData.push(student)
      }).on('end', async () => {
        try{
          const today = new Date().toISOString().split('T')[0];
          await Attendance.updateOne(
            {date: today},
            { $set: { students: updateData}}
          );
          fs.unlinkSync(filePath);
          res.status(200).json({message:'Data updated succesffuly'});
        }catch(error){
          console.error('Error reading the message', error);
          res.status(500).json({message: 'Failed to update data'});
        }
      });
    }else{
      res.status(400).json({message:'No file uploaded'});
    }
  }catch(error){
    console.error('Error', error);
    res.status(500).json({message:'Server error'});
  }
})

router.post('/attendance/upload/:teacherName', upload.single('file'), async (req, res) => {
  const {teacherName} = req.params

  const Attendance = getAttendanceModel(teacherName);

  try{
    if(req.file){
      const filePath = req.file.path;
      const updateData = [];

      fs.createReadStream(filePath).pipe(csv()).on('data', (row) => updateData.push(row)).on('end', async () => {
        try{
          const today = new Date().toISOString().split('T')[0];
          await Attendance.updateOne(
            {date: today},
            { $set: { students: updateData}}
          );
          fs.unlinkSync(filePath);
          res.status(200).json({message:'Data updated succesffuly'});
        }catch(error){
          console.error('Error reading the message', error);
          res.status(500).json({message: 'Failed to update data'});
        }
      });
    }else{
      res.status(400).json({message:'No file uploaded'});
    }
  }catch(error){
    console.error('Error', error);
    res.status(500).json({message:'Server error'});
  }
})


router.post('/attendance/download/:teacherName', async (req, res) => {
  const {teacherName} = req.params;
  const Attendance = getAttendanceModel(teacherName);

  try{
    const allAttendance = await Attendance.find({});

    if(!allAttendance.length){
      return res.status(404).json({ message:'No attendance records found'});
    }

    const headers = ['Name'];
    const dates = allAttendance.map((record) => record.date);
    headers.push(...dates, 'Total Classes', 'Classes Attended', 'Percentage of Attendance');


    const studentsMap = new Map();
    allAttendance.forEach((record) => {
      record.students.forEach((student) => {
        if(!studentsMap.has(student.name)){
          studentsMap.set(student.name, []);
        }
        studentsMap.get(student.name).push({
          date: record.date,
          isPresent: student.isPresent,
        });
      });
    });

    const csvData = [];
    studentsMap.forEach((attendances, name) =>{
      const row = {Name : name };
      let totalClasses = dates.length;
      let attendedClasses =0;

      dates.forEach((date) => {
        const attendanceRecord = attendances.find((a) => a.date === date);
        if(attendanceRecord && attendanceRecord.isPresent) {
          row[date] = 'P';
          attendedClasses++;
        }else{
          row[date] = 'A';
        }
      });

      const percentage = ((attendedClasses/totalClasses)*100).toFixed(2);
      row['Total Classes'] = totalClasses;
      row['Classes Attended'] = attendedClasses;
      row['Classes Absent'] = totalClasses - attendedClasses;
      row['Percentage of Attendance'] = `${percentage}`;

      csvData.push(row);
    })

    const csvString = parse(csvData, { fields: headers });

    res.setHeader('Content-Type', 'text/csv');
    res.setHeader('Content-Disposition', 'attachment; filename=attendance.csv');
    res.status(200).send(csvString);
  }catch(error){
    console.error('Error genrating csv', error);
    res.status(500).json({ message : 'Server error'});
  }
});

router.get('/attendance/download/:teacherName', async (req, res) => {
  const { teacherName } = req.params;
  const Attendance = getAttendanceModel(teacherName);

  try {
    const allAttendance = await Attendance.find({});

    if (!allAttendance.length) {
      return res.status(404).json({ message: 'No attendance records found' });
    }

    const headers = ['Name'];
    const studentsMap = new Map();

    // Collect attendance data
    allAttendance.forEach((record) => {
      const date = record.date;

      record.students.forEach((student) => {
        if (!studentsMap.has(student.name)) {
          studentsMap.set(student.name, {});
        }

        if (!studentsMap.get(student.name)[date]) {
          studentsMap.get(student.name)[date] = [];
        }

        studentsMap.get(student.name)[date].push(student.isPresent);
      });
    });

    // Determine unique dates
    const uniqueDates = Array.from(new Set(allAttendance.map(record => record.date)));

    // Create dynamic headers for attendance entries
    uniqueDates.forEach(date => {
      const entryCount = Math.max(...Array.from(studentsMap.values()).map(attendance => (attendance[date] || []).length));
      for (let i = 1; i <= entryCount; i++) {
        headers.push(`${date}_${i}`);
      }
    });

    // Add total columns to headers
    headers.push('Total Classes', 'Classes Attended', 'Classes Absent', 'Percentage of Attendance');

    const csvData = [];
    studentsMap.forEach((attendance, name) => {
      const row = { Name: name };
      let totalClasses = 0; // Change to count each entry
      let attendedClasses = 0;

      uniqueDates.forEach(date => {
        const entries = attendance[date] || [];
        entries.forEach((entry, index) => {
          row[`${date}_${index + 1}`] = entry ? 'P' : 'A'; // Mark 'P' or 'A'
          totalClasses++; // Count each entry as a class
          if (entry) attendedClasses++; // Count attended classes
        });
      });

      // Calculate totals
      row['Total Classes'] = totalClasses; // Total classes now counts all entries
      row['Classes Attended'] = attendedClasses;
      row['Classes Absent'] = totalClasses - attendedClasses;
      row['Percentage of Attendance'] = ((attendedClasses / totalClasses) * 100).toFixed(2); // Calculate percentage

      csvData.push(row);
    });

    const csvString = parse(csvData, { fields: headers });

    res.setHeader('Content-Type', 'text/csv');
    res.setHeader('Content-Disposition', 'attachment; filename=attendance.csv');
    res.status(200).send(csvString);
  } catch (error) {
    console.error('Error generating csv', error);
    res.status(500).json({ message: 'Server error' });
  }
});


// // Fetching the unique dates 
router.get('/attendance/dates/:teacherName', async(req,res) => {
  const { teacherName } = req.params;
  const Attendance = getAttendanceModel(teacherName);

  try{
    const records = await Attendance.find({});
    const uniqueDates = [...new Set(records.map(record => record.date))];
    res.status(200).json(uniqueDates);
  }catch(error){
    console.error('Error fetching the dates:', error);
    res.status(500).json({ message: 'Failed to fetch dates'});
  }
});

// Update the record 
router.put('/attendance/update/:teacherName/:id', async (req, res) => {
  const { teacherName, id } = req.params;
  const { students } = req.body;

  const Attendance = getAttendanceModel(teacherName);

  try {
    // Fetch the document for the given ID
    const attendanceRecord = await Attendance.findById(id);

    if (!attendanceRecord) {
      return res.status(404).json({ message: 'No document found for the given ID' });
    }

    // Loop through each student in the request body
    students.forEach((updatedStudent) => {
      // Find the index of the student in the existing array
      const studentIndex = attendanceRecord.students.findIndex(
        (student) => student.name === updatedStudent.name
      );

      if (studentIndex > -1) {
        // Update the existing student's presence status
        attendanceRecord.students[studentIndex].isPresent = updatedStudent.isPresent;
      } else {
        // If the student is not found, you can choose to add them
        attendanceRecord.students.push(updatedStudent);
      }
    });

    // Save the updated attendance record
    await attendanceRecord.save();

    res.status(200).json({ message: 'Attendance updated successfully' });
  } catch (error) {
    console.error('Error updating attendance:', error);
    res.status(500).json({ message: 'Failed to update attendance' });
  }
});


router.get('/attendance/documents/:teacherName/:date', async (req, res) => {
  const { teacherName, date } = req.params;
  
  const Attendance = getAttendanceModel(teacherName); // Get the correct attendance model

  try {
    // Fetch documents for the specific teacher and date
    const documents = await Attendance.find({ date });
    
    if (!documents.length) {
      return res.status(404).json({ message: 'No documents found for the given date' });
    }

    res.json(documents); // Send the documents as response
  } catch (error) {
    console.error('Error fetching the data:', error);
    res.status(500).json({ message: 'Error fetching documents' });
  }
});



router.get('/test', (req, res) => {
  res.send('Test route is working');
});


module.exports = router;
