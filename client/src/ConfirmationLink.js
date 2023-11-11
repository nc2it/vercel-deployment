import React from 'react';
import { useLocation } from 'react-router-dom';
import './ConfirmationLink.css';

export function ConfirmationLink() {
  const location = useLocation();
  const { meeting, link } = location.state;

  async function copyToClipboard(text) {
    try {
      await navigator.clipboard.writeText(text);
      alert('Text copied to clipboard');
    } catch (err) {
      console.error('Failed to copy: ', err);
    }
  }

  const handleCopyClick = () => {
    copyToClipboard(link);
  };

  return (
    <div className="confirmationLinkContainer">

      <h1>Your Meeting Link</h1>

      <h2>Meeting Details</h2>
      <h2>{meeting.title}</h2>
      <h2>Agenda:</h2>
      <p>{meeting.agenda}</p>
      <h2>Participants:</h2>
      {meeting.participants.map((participant, index) => (
        <div className="participant" key={index}>
          <p>{participant.name} ({participant.email})</p>
        </div>
      ))}
       <h2>Proposed dates:</h2>
       {meeting.dateChoices[0].startDateTime}
       {meeting.dateChoices.map((dateChoice, index) => (
        <div className="participant" key={index}>
          <p>{dateChoice.startDateTime} ({dateChoice.endDateTime})</p>
        </div>
      ))}
       
       <h2>Proposed Locations:</h2>


      <h2>Please share this link : </h2> {link}
      <button onClick={handleCopyClick}>Copy to Clipboard</button>
    </div>
  );
}

export default ConfirmationLink;