

import React, { useState } from 'react';
import './App.css';


// Define the server URL
const SERVER_URL = process.env.REACT_APP_SERVER_URL || 'http://localhost:300';

function App() {
  return (
    <div className="App">
      <header className="App-header">
        <MeetingTitleParticipantForm />
      </header>
    </div>
  );
}

export default App;

function MeetingTitleParticipantForm() {
  const [meeting, setMeeting] = useState({
    title: '',
    participant: { name: '', email: '' },
    dateChoices: [{ startDateTime: '', endDateTime: '', selectedBy: '' }],
    locationChoices: [{ location: '', selectedBy: '' }],
    agenda: '',
  });

  const handleChange = (e) => {
    setMeeting({ ...meeting, [e.target.name]: e.target.value });
  };

  const handleAgendaChange = (e) => {
    setMeeting({ ...meeting, [e.target.name]: e.target.value });
  };

  const handleParticipantChange = (e) => {
    setMeeting({
      ...meeting,
      participant: { ...meeting.participant, [e.target.name]: e.target.value }
    });
  };

  const handleDateChange = (index, e) => {
    const updatedDateChoices = meeting.dateChoices.map((choice, i) => {
      if (i === index) {
        return { ...choice, [e.target.name]: e.target.value };
      }
      return choice;
    });
    setMeeting({ ...meeting, dateChoices: updatedDateChoices });
  };

  const addDateChoice = () => {
    setMeeting({
      ...meeting,
      dateChoices: [...meeting.dateChoices, { date: '', selectedBy: '' }]
    });
  };

  const deleteDateChoice = (index) => {
    if (meeting.dateChoices.length > 1) {
      const updatedDateChoices = meeting.dateChoices.filter((_, i) => i !== index);
      setMeeting({ ...meeting, dateChoices: updatedDateChoices });
    }
  };

  const handleLocationChange = (index, e) => {
    const updatedLocationChoices = meeting.locationChoices.map((choice, i) => {
      if (i === index) {
        return { ...choice, [e.target.name]: e.target.value };
      }
      return choice;
    });
    setMeeting({ ...meeting, locationChoices: updatedLocationChoices });
  };

  const addLocationChoice = () => {
    setMeeting({
      ...meeting,
      locationChoices: [...meeting.locationChoices, { location: '', selectedBy: '' }]
    });
  };

  const deleteLocationChoice = (index) => {
    if (meeting.locationChoices.length > 1) {
      const updatedLocationChoices = meeting.locationChoices.filter((_, i) => i !== index);
      setMeeting({ ...meeting, locationChoices: updatedLocationChoices });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch(`${SERVER_URL}/new`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          title: meeting.title,
          participants: [meeting.participant],
          dateChoices: [meeting.dateChoices],
          locationChoices: [meeting.locationChoices],
          agenda: meeting.agenda,
          //// Wrapping participant in an array
        })
      });

      if (response.ok) {
        const responseData = await response.json();
        console.log('Meeting created:', responseData);
        // Handle successful response, e.g., displaying a success message or redirecting
        
      } else {
        // Handle non-successful responses
        throw new Error('Network response was not ok.');
      }
    } catch (error) {
      console.error('Error during form submission:', error);
      // Handle errors, e.g., displaying an error message to the user
    }
  };

  return (<>
    <svg width="100" height="50" xmlns="http://www.w3.org/2000/svg">
      <rect x="10" y="10" width="80" height="30" fill="blue" />
      <text x="15" y="30" font-family="Verdana" font-size="15" fill="white">Meet Me</text>
    </svg>
    <form onSubmit={handleSubmit}>

      <div className="form-group">
        <label>Name:</label>
        <input type="text" name="name" value={meeting.participant.name} onChange={handleParticipantChange} />
      </div>
      <div className="form-group">
        <label>Email:</label>
        <input type="email" name="email" value={meeting.participant.email} onChange={handleParticipantChange} />
      </div>

      <div className="form-group">
        <label>Title:</label>
        <input type="text" name="title" value={meeting.title} onChange={handleChange} />
      </div>

      <div className="form-group">
        <label>Agenda:</label>
        <input type="text" name="agenda" value={meeting.agenda} onChange={handleAgendaChange} />
      </div>

      {meeting.dateChoices.map((choice, index) => (
        <div key={index} className="form-group">
          <label>
            Start Date and Time:
            <input
              type="datetime-local"
              name="startDateTime"
              value={choice.startDateTime}
              onChange={(e) => handleDateChange(index, e)}
            />
          </label>
          <label>
            End Date and Time:
            <input
              type="datetime-local"
              name="endDateTime"
              value={choice.endDateTime}
              onChange={(e) => handleDateChange(index, e)}
            />
          </label>

          <button type="button" onClick={addDateChoice}>Add Date Choice</button>
          <button
            type="button"
            onClick={() => deleteDateChoice(index)}
            disabled={meeting.dateChoices.length === 1}
          >
            Delete Date Choice
          </button>
        </div>
      ))}

      {meeting.locationChoices.map((choice, index) => (
        <div key={index} className="form-group">
          <label>
            Location Choice:
            <input
              type="text"
              name="location"
              value={choice.location}
              onChange={(e) => handleLocationChange(index, e)}
            />
          </label>
          <button type="button" onClick={addLocationChoice}>Add Location Choice</button>
          <button
            type="button"
            onClick={() => deleteLocationChoice(index)}
            disabled={meeting.locationChoices.length === 1}
          >
            Delete location Choice
          </button>
        </div>
      ))}

      <button type="submit">Submit</button>
    </form>

  </>
  );
}

