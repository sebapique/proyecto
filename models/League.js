const mongoose = require('mongoose');
const { Schema } = mongoose;
const ObjectId = Schema.ObjectId;
var LeagueSchema = new Schema({
    name: { type: String, required: true },
    users: [{ friend: String, points: Number }]
})

module.exports = mongoose.model('League', LeagueSchema);