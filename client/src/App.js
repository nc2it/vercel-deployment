import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import Createmeeting from './CreateMeeting';
import { ConfirmationLink } from './ConfirmationLink';
import { MeetingDetails } from './MeetingDetails';
import { MeetingSummary } from './MeetingSummary';


function App() {
  return (
    <Router>
      <div>
        <nav>
          <ul>
          
            <li>
              <Link to="/create">Create a meetlink</Link>
            </li>
          </ul>
        </nav>

        {/* A <Routes> looks through its children <Route>s and
            renders the first one that matches the current URL. */}
        <Routes>
          <Route path="/" element={<div>ho</div>} />
          <Route path="/create" element={<Createmeeting />} />
          <Route path="/getyourlink" element={<ConfirmationLink />} />
          <Route path="/meetme/:id" element={<MeetingDetails/>} />
          <Route path="/meetingsummary/:id" element={<MeetingSummary/>} />
        </Routes>
      </div>
    </Router>
  );
}





export default App;