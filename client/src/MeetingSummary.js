import React, { useState, useEffect } from 'react';


import { useNavigate, useParams } from "react-router-dom"
// Assuming you have this CSS file

export function MeetingSummary() {
  const [meeting, setMeeting] = useState(null);
  const [summary, setSummary] = useState(null);
  const [error, setError] = useState('');
  const [selectedDate, setSelectedDate] = useState('');
  const [selectedLocation, setSelectedLocation] = useState('');
  const [email, setEmail] = useState(''); // New state for email
  const [isEmailEntered, setIsEmailEntered] = useState(false); // St
  const params = useParams();
  const SERVER_URL =  'https://vercel-deployment-000.vercel.app'// process.env.REACT_APP_SERVER_URL || 'http://localhost:3010';

  const navigate = useNavigate();



  useEffect(() => {
    async function fetchMeeting() {
      console.log("fetching" + params.id);
      try {
        const response = await fetch(`${SERVER_URL}/meetings/${params.id}`);


        if (!response.ok) {
          throw new Error('Meeting not found');
        }

        const data = await response.json();
        console.log(data);
        setMeeting(data);
        setSummary(countSelections(data.participants, data.locationChoices, data.dateChoices));

      } catch (error) {
        setError(error.message);
      }
    }

    fetchMeeting();
  }, [params.id]);
  const handleDateChange = (e) => {
    setSelectedDate(e.target.value);
  };

  const handleLocationChange = (e) => {
    setSelectedLocation(e.target.value);
  };
  const handleEmailChange = (e) => {
    setEmail(e.target.value);
  };

  const handleEmailSubmit = (e) => {
    e.preventDefault();
    if (email) { // Check if email is not empty
      setIsEmailEntered(true);
    } else {
      setError('Please enter a valid email.');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    console.log("____________")
    console.log(selectedDate)
    console.log(selectedLocation)
    try {
      const response = await fetch(`${SERVER_URL}/meetings/${params.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        // body: JSON.stringify(payload)
        body: JSON.stringify({
          title: meeting.title,
          participants: meeting.participants, // Assuming participants list stays the same
          dateChoices: meeting.dateChoices,
          locationChoices: meeting.locationChoices, // Assuming locationChoices stays the same
          agenda: meeting.agenda,
          startTime: selectedDate.startDateTime,
          endTime: selectedDate.endDateTime,
          location:selectedLocation.location
        })
      });

        if (response.ok) {
            const responseData = await response.json();
            console.log('Meeting created:', responseData);
            navigate('/');  // Navigate to home page});
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




  function countSelections(users, locationChoices, dateChoices) {
    const locationCounts = locationChoices.map(locationChoice => {
      return {
        location: locationChoice.location,
        count: users.filter(user => user.selectedLocation === locationChoice.location).length
      };
    });

    const dateCounts = dateChoices.map(dateChoice => {
      return {
        startDateTime: dateChoice.startDateTime,
        endDateTime: dateChoice.endDateTime,
        count: users.filter(user => user.selectedDate >= dateChoice.startDateTime && user.selectedDate <= dateChoice.endDateTime).length
      };
    });

    return { locationCounts, dateCounts };
  }

  

  if (error) {
    return <div className="error">Error: {error}</div>;
  }

  if (!meeting) {
    return <div>Loading...</div>;
  }



  return (
    <div className="meetingDetailsContainer">
      {!isEmailEntered ? (
        <form onSubmit={handleEmailSubmit}>
          <label>
            Enter your email:
            <input type="email" value={email} onChange={handleEmailChange} />
          </label>
          <button type="submit">Submit</button>
        </form>
      ) : (


        <>
          <h2>Meeting Details</h2>
          <div className="meetingDetailsContainer">
            <p>Welcome {email}</p>

            <h2>Meeting Details</h2>
            <p><strong>Title:</strong> {meeting.title}</p>
            <p><strong>Agenda:</strong> {meeting.agenda}</p>

          </div>
          {

meeting.participants.some(participant => participant.email === email) ? (
  <>
    <h2>Summary</h2>

    <h3>Locations</h3>
    <table>
      <thead>
        <tr>
          <th>Location</th>
          <th>Count</th>
        </tr>
      </thead>
      <tbody>
        {summary.locationCounts.map(item => (
          <tr key={item.location}>
            <td>{item.location}</td>
            <td>{item.count}</td>
          </tr>
        ))}
      </tbody>
    </table>

    <h3>Dates</h3>
    <table>
      <thead>
        <tr>
          <th>Start Date Time</th>
          <th>End Date Time</th>
          <th>Count</th>
        </tr>
      </thead>
      <tbody>
        {summary.dateCounts.map(item => (
          <tr key={item.startDateTime}>
            <td>{new Date(item.startDateTime).toLocaleString()}</td>
            <td>{new Date(item.endDateTime).toLocaleString()}</td>
            <td>{item.count}</td>
          </tr>
        ))}
      </tbody>
    </table>

    <h3>Participants preference</h3>
    <table>
      <thead>
        <tr>
          <th>Email</th>
          <th>Selected Date</th>
          <th>Selected Location</th>
        </tr>
      </thead>
      <tbody>
        {meeting.participants.map(item => (
          <tr key={item.email}>
            <td>{item.email}</td>
            <td>{item.selectedDate ? new Date(item.selectedDate).toLocaleString() : 'N/A'}</td>
            <td>{item.selectedLocation || 'N/A'}</td>
          </tr>
        ))}
      </tbody>
    </table>


    <h2>Make a Selection</h2>

{/* Dropdown for Date Selection */}
<div>
  <label htmlFor="dateSelection">Select a Date:</label>
  <select id="dateSelection" value={selectedDate} onChange={handleDateChange}>
    {summary.dateCounts.map(item => (
      <option key={item.startDateTime} value={item.startDateTime}>
        {new Date(item.startDateTime).toLocaleString()}
      </option>
    ))}
  </select>
</div>

{/* Dropdown for Location Selection */}
<div>
  <label htmlFor="locationSelection">Select a Location:</label>
  <select id="locationSelection" value={selectedLocation} onChange={handleLocationChange}>
    {summary.locationCounts.map(item => (
      <option key={item.location} value={item.location}>
        {item.location}
      </option>
    ))}
  </select>
</div>

<button onClick={handleSubmit}>Finalise Meeting </button>
  </>
)  : (
              <>
                <h2>you are not registered for this meeting</h2>
                <p> You can register the meeting details <a href={`/meetme/${params.id}`}>here</a></p>
              </>
            )
          }
        </>
      )}
    </div>
  );


}