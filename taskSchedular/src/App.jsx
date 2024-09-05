import React, { useState, useEffect } from 'react';
import axios from 'axios';

function App() {
  const [events, setEvents] = useState([]);
  const [newEvent, setNewEvent] = useState({ title: '', start: '', end: '' });
  const [error, setError] = useState('');

  useEffect(() => {
    axios.get('http://localhost:5000/events')
      .then(response => setEvents(response.data))
      .catch(error => console.error(error));
  }, []);

  const handleInputChange = (e) => {
    setNewEvent({
      ...newEvent,
      [e.target.name]: e.target.value
    });
  };

  const handleAddEvent = () => {
    if (newEvent.start >= newEvent.end) {
      setError('End time must be after start time.');
      return;
    }

    axios.post('http://localhost:5000/events', newEvent)
      .then(response => {
        setEvents([...events, response.data]);
        setNewEvent({ title: '', start: '', end: '' });
        setError('');
      })
      .catch(error => {
        setError(error.response.data.message);
      });
  };

  const handleDeleteEvent = (id) => {
    axios.delete(`http://localhost:5000/events/${id}`)
      .then(() => {
        setEvents(events.filter(event => event.id !== id));
      })
      .catch(error => console.error(error));
  };


  function formatTime(time) {
    const [hours, minutes] = time.split(':').map(Number);
    const period = hours >= 12 ? 'PM' : 'AM';
    const formattedHours = ((hours + 11) % 12 + 1);
    return `${formattedHours}:${minutes.toString().padStart(2, '0')} ${period}`;
  }

  return (
    <div>
      <h1>Event Scheduler</h1>
      <div>
        <h2>Add Event</h2>
        <input
          type="text"
          name="title"
          placeholder="Event Title"
          value={newEvent.title}
          onChange={handleInputChange}
        />
        <input
          type="time"
          name="start"
          value={newEvent.start}
          onChange={handleInputChange}
        />
        <input
          type="time"
          name="end"
          value={newEvent.end}
          onChange={handleInputChange}
        />
        <button onClick={handleAddEvent}>Add Event</button>
        {error && <p style={{ color: 'red' }}>{error}</p>}
      </div>
      <div>
        <h2>Events</h2>
        <ul>
          {events.map((event) => (
            <li key={event.id}>
              {event.title} - {formatTime(event.start)} to {formatTime(event.end)}
              <button onClick={() => handleDeleteEvent(event.id)}>Delete</button>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

export default App;
