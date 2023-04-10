const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const userOTP = new Schema({
    username: { type: String, required: true },
    otp: { type: Number, required: true },
    createAt: { type: Date, required: true },
    expireAt: { type: Date, required: true }
})

module.exports = mongoose.model('userOTP', userOTP);
