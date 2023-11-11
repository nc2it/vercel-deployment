import React, { useState, useEffect } from 'react';


import { useNavigate ,useParams} from "react-router-dom"
// Assuming you have this CSS file

export function MeetingDetails() {
  const [meeting, setMeeting] = useState(null);
  const [error, setError] = useState('');
  const [selectedDate, setSelectedDate] = useState('');
  const [selectedLocation, setSelectedLocation] = useState('');
  const [email, setEmail] = useState(''); // New state for email
  const [isEmailEntered, setIsEmailEntered] = useState(false); // St
  const params = useParams();
  const SERVER_URL = 'https://vercel-deployment-000.vercel.app' //process.env.REACT_APP_SERVER_URL || 'http://localhost:3010';

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

    console.log("meeting.dateChoices___________");
    console.log(meeting.dateChoices);

    // Update dateChoices with the user's email for the selected date
    const updatedDateChoices = meeting.dateChoices.map(choice => {


      console.log("______________");
      console.log(selectedDate);

      console.log(choice);


      console.log("______________");

      //console.log( choice.startDateTime,choice.endDateTime,choice.selectedBy);

      if (choice.startDateTime === selectedDate) {
        console.log("selectedDate________" + selectedDate);
        console.log(JSON.stringify({ ...choice, selectedBy: [email] }));

        return { ...choice, selectedBy: { email: email } };

      }

      // console.log("choice.startDateTime_____" + choice.startDateTime);
      // if (new Date(choice.startDateTime).toISOString() === new Date(selectedDate).toISOString() ) {

      //   console.log("selectedDate" +    console.log(choice));

      // }


      return choice;
    });

    // Prepare the payload with updated dateChoices
    const payload = {
      title: meeting.title,
      participants: meeting.participants, // Assuming participants list stays the same
      dateChoices: updatedDateChoices,
      locationChoices: meeting.locationChoices, // Assuming locationChoices stays the same
      agenda: meeting.agenda,
    };

    try {
      const response = await fetch(`${SERVER_URL}/meetings/${params.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        // body: JSON.stringify(payload)
        body: JSON.stringify({

          participants: [...meeting.participants, { email: email, selectedDate: selectedDate, selectedLocation: selectedLocation }],

        })
      });

      console.log(JSON.stringify(payload));
      if (response.ok) {
        const responseData = await response.json();
        console.log('Meeting created:', responseData);
         navigate(`/meetingsummary/${params.id}`);
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
            <div>
              <strong>Participants:</strong>
              {meeting.participants.map(item => (<p className="participant">{item.email}</p>))}
            </div>

            {
              meeting.participants.some(participant => participant.email === email) ? (<>
               <h2> You have already submitted your response</h2>
               <p> You can view the meeting details <a href={`/meetingsummary/${params.id}`}>here</a></p>  
       
               </>
              ) : (
                <div className="meetingDetailsContainer">
                <form onSubmit={handleSubmit}>
                  <strong>Date Choices:</strong>
                  <br></br>
                  <br></br>
                  {meeting.dateChoices.map((item, index) => (
                    <div>
                      <label key={index}>
                        <input
                          type="radio"
                          value={item.startDateTime} the for
                          checked={selectedDate === item.startDateTime}
                          onChange={handleDateChange}
                        />
                        {new Date(item.startDateTime).toLocaleString()} - {new Date(item.endDateTime).toLocaleString()}
                      </label>
                      <br></br>
                      <br></br>
                    </div>
                  ))}
  
                  <br></br>
                  <br></br>
                  <strong>Location Choices:</strong>
                  <br></br>
                  <br></br>
                  {meeting.locationChoices.map((item, index) => (<div>
                    <label key={index}>
                      <input
                        type="radio"
                        value={item.location}
                        checked={selectedLocation === item.location}
                        onChange={handleLocationChange}
                      />
                      {item.location}
                    </label>
                    <br></br>
                    <br></br>
                  </div>
                  ))}
  
  
                  <button type="submit">Submit</button>
                </form>
  
  
              </div>
              )
            }

            
          </div>
        </>
      )}
    </div>
  );


}