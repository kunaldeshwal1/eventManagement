const mongoose = require('mongoose');

const eventSchema = new mongoose.Schema({
    date: { type: String, required: true },
    title: { type: String, required: true },
    start: { type: String, required: true },
    end: { type: String, required: true },
});

module.exports = mongoose.model('Event', eventSchema);
