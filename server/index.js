const express = require('express');
const mongoose = require('mongoose');
require('dotenv').config();
const nodemailer = require('nodemailer');

const app = express();
app.use(express.json());

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: 'vierafajnor@gmail.com',
    pass: 'Chalais2005'
  }
});

// MongoDB URI and connection
const uri =  'mongodb+srv://meetme:hotjava@meet.iyufxz7.mongodb.net/?retryWrites=true&w=majority'//process.env.MONGO_URI;
mongoose.connect(uri, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('Connected to MongoDB'))
  .catch(err => console.error('Could not connect to MongoDB', err));

// Mongoose Schema and Model for Meeting
const meetingSchema = new mongoose.Schema({
  title: String,
  participants: [String], // Array of participant names
  startTime: Date,
  endTime: Date,
  location: String
});

const Meeting = mongoose.model('Meeting', meetingSchema);

// CRUD Operations for Meetings
// Create a Meeting
app.post('/meetings', async (req, res) => {
  const meeting = new Meeting(req.body);
  try {
    const result = await meeting.save();
    res.status(201).json(result);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Function to generate a meeting link
function generateMeetingLink(meeting) {
  const baseUrl =  `http://${process.env.uri}/meetings/`;
  return `${baseUrl}${meeting._id}`;
}

// Example usage in the Create Meeting endpoint
app.post('/new', async (req, res) => {
  try {
    const meeting = new Meeting(req.body);
    const savedMeeting = await meeting.save();
    const meetingLink = generateMeetingLink(savedMeeting);

    inviteByMail(savedMeeting);
    
    res.status(201).json({ meeting: savedMeeting, link: meetingLink });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.post('/', async (req, res) => {
  try {
    res.status(201).json({ meessage:"Welcome to MeetMe"});
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get All Meetings
app.get('/meetings', async (req, res) => {
  try {
    const meetings = await Meeting.find();
    res.json(meetings);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get a Meeting by ID
app.get('/meetings/:id', async (req, res) => {
  try {
    const meeting = await Meeting.findById(req.params.id);
    if (!meeting) {
      return res.status(404).send('Meeting not found');
    }
    res.json(meeting);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Update a Meeting by ID
app.put('/meetings/:id', async (req, res) => {
  try {
    const result = await Meeting.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json(result);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Delete a Meeting by ID
app.delete('/meetings/:id', async (req, res) => {
  try {
    const result = await Meeting.findByIdAndRemove(req.params.id);
    res.json(result);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});


const inviteByMail= (meeting) => {
  try {
    // ... (existing code for creating a meeting)

    // Send an email after the meeting is created
    const mailOptions = {
      from: 'your-email@gmail.com',
      to: 'nchalais@gmail.com', // The email address of the participant
      subject: 'New Meeting Created',
      text: `A new meeting titled "${meeting.title}" has been created.`
    };

    transporter.sendMail(mailOptions, function(error, info){
      if (error) {
        console.log(error);
      } else {
        console.log('Email sent: ' + info.response);
      }
    });

    // ... (rest of your endpoint code)

  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}

const port = process.env.PORT || 3000; 
app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});
