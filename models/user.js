const mongoose = require('mongoose')

const Schema = mongoose.Schema;

const User = new Schema({
    username: { type: String, defaultValue: 'Emty' },
    password: { type: String },
    score: { type: String, defaultValue: 0 },
    positionX: { type: String, defaultValue: "" },
    positionY: { type: String, defaultValue: "" },
    positionZ: { type: String, defaultValue: "" }
})

module.exports = mongoose.model('User', User)