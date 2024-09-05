const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');

const app = express();

app.use(cors());
app.use(bodyParser.json());

const PORT = 5000;
let events = [
    { id: 1, title: 'Meeting', start: '09:00', end: '10:00' },
    { id: 2, title: 'Lunch', start: '12:00', end: '13:00' },
    { id: 3, title: 'Workout', start: '18:00', end: '19:00' },
];

function timeToDate(time) {
    const [hours, minutes] = time.split(':').map(Number);
    return new Date(1970, 0, 1, hours, minutes);
}

function checkConflict(newEvent) {
    const newEventStart = timeToDate(newEvent.start);
    const newEventEnd = timeToDate(newEvent.end);

    return events.some(event => {
        const eventStart = timeToDate(event.start);
        const eventEnd = timeToDate(event.end);

        return (newEventStart < eventEnd && newEventEnd > eventStart);
    });
}

app.get('/events', (req, res) => {
    res.json(events);
});

app.post('/events', (req, res) => {
    const newEvent = { ...req.body, id: events.length + 1 };
    if (checkConflict(newEvent)) {
        res.status(400).json({ message: 'Event conflicts with an existing event.' });
    } else {
        events.push(newEvent);
        res.status(201).json(newEvent);
    }
});

app.delete('/events/:id', (req, res) => {
    const { id } = req.params;
    events = events.filter(event => event.id !== parseInt(id, 10));
    res.status(204).send();
});

app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});
