// const express = require('express');
// const mongoose = require('mongoose');
// require('dotenv').config();
// const nodemailer = require('nodemailer');

import express from 'express';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import nodemailer from 'nodemailer';
import ical from 'ical-generator';
import cors from 'cors';




const app = express();
app.use(express.json());
app.use(cors());

const transporter = nodemailer.createTransport({
  service: 'gmail',
  securre: false,
  auth: {
    user: 'letsmeetmybuddy@gmail.com',
    pass: 'dbwz bsji seen byky'
  }
});

const calendar = ical({ domain: 'your-domain.com', name: 'My Calendar' });


function createCalendarInvite(meeting) {

 // const calendar = ical({ domain: 'yourdomain.com', name: 'My Calendar' });
  calendar.createEvent({
    start: meeting.startTime,
    end: meeting.endTime,
    summary: meeting.title,
    description: 'Meeting with ' + meeting.participants.join(', '),
    location: meeting.location
  });

  return calendar.toString();
}


// MongoDB URI and connection
const uri =  'mongodb+srv://meetme:hotjava@meet.iyufxz7.mongodb.net/?retryWrites=true&w=majority'//process.env.MONGO_URI;
mongoose.connect(uri, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('Connected to MongoDB'))
  .catch(err => console.error('Could not connect to MongoDB', err));

// User Schema
const userSchema = new mongoose.Schema({
  name: String,
  email: {
    type: String,
    required: true,
    unique: true
  }
});

// Date Choice Schema
const dateChoiceSchema = new mongoose.Schema({
  date: Date,
  selectedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }
});

// Location Choice Schema
const locationChoiceSchema = new mongoose.Schema({
  location: String,
  selectedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }
});

// Meeting Schema
const meetingSchema = new mongoose.Schema({
  title: String,
  participants: [userSchema], // Array of users
  dateChoices: [dateChoiceSchema], // Multiple date choices
  locationChoices: [locationChoiceSchema], // Multiple location choices
  startTime: Date, // Finalized start time
  endTime: Date, // Finalized end time
  location: String,// Finalized location
  agenda: String // objectives
});

// Create Models
const User = mongoose.model('User', userSchema);
const Meeting = mongoose.model('Meeting', meetingSchema);


// CRUD Operations for Meetings
// Create a Meeting
app.post('/meetings', async (req, res) => {
  
  const meeting = new Meeting({
    title: req.body.title,
    participants: req.body.participants, // Array of user objects
    dateChoices: req.body.dateChoices,   // Array of date choice objects
    locationChoices: req.body.locationChoices, // Array of location choice objects
    startTime: req.body.startTime,       // Optionally set a fixed start time
    endTime: req.body.endTime,           // Optionally set a fixed end time
    location: req.body.location,
    agenda: req.body.agenda           // Optionally set a fixed location
  });


  try {
    const result = await meeting.save();
    res.status(201).json(result);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Function to generate a meeting link
function generateMeetingLink(meeting) {
  const baseUrl =  `http://localhost:/meetings/`;
  return `${baseUrl}${meeting._id}`;
}

// Example usage in the Create Meeting endpoint
app.post('/new', async (req, res) => {
  try {
    console.log("req.body", req.body);
      const meeting = new Meeting({
      title: req.body.title,
      participants: req.body.participants, // Array of user objects
      dateChoices: req.body.dateChoices,   // Array of date choice objects
      locationChoices: req.body.locationChoices, // Array of location choice objects
      startTime: req.body.startTime,       // Optionally set a fixed start time
      endTime: req.body.endTime,           // Optionally set a fixed end time
      location: req.body.location,
      agenda: req.body.agenda          // Optionally set a fixed location
    });
    const savedMeeting = await meeting.save();
    const meetingLink = generateMeetingLink(savedMeeting);

   // inviteByMail(savedMeeting);
   sendMeetingInvite(savedMeeting, meetingLink);
    
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
      from: 'vierafajnor@gmail.com',
      to: 'nchalais@gmail.com', // The email address of the participant
      subject: 'New Meeting Created',
      text: `A new meeting titled "${meeting.title}" has been created.`,
        attachments: [
      {
        filename: 'invite.ics',
        content: icsFileContent,
        contentType: 'text/calendar'
      }
    ]
      
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

async function sendMeetingInvite(meeting,meetingLink) {

  const calendar = ical({ domain: 'yourdomain.com', name: 'My Calendar' });
  // ...rest of your code to create event...
  
  // Add event to the calendar
  // Add event to the calendar
  calendar.createEvent({
    start: meeting.startTime,
    end: meeting.endTime,
    summary: meeting.title,
    description: meeting.agenda,
    location: meeting.location,
    organizer: {
      name: meeting.participants[0].name,  // The organizer's name (optional)  
      email: meeting.participants[0].email
    }
  });

  const icsFileContent = calendar.toString();

  const mailOptions = {
    from: 'your-email@gmail.com',
    to: meeting.participants[0].email, // The email address of the participant
    subject: 'New Meeting Created ' + meeting.participants[0].name,
    text: `A new meeting titled "${meeting.title}" has been created.` +meeting.participants[0].email +" Your Meeting Link is " + meetingLink,
      attachments: [
    {
      filename: 'invite.ics',
      content: icsFileContent,
      contentType: 'text/calendar'
    }
  ]
  };

  try {
    const info = await transporter.sendMail(mailOptions);
    console.log('Email sent: ' + info.response);
  } catch (error) {
    console.error('Error sending email:', error);
  }
}

const port = process.env.PORT || 300; 
app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});
