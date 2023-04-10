const user = require('../models/user');

const userOTP = require('../models/userOTP');

// password handler

const bcrypt = require('bcryptjs');

const saltRounds = 10;

async function hashPassword(password) {
    try {
        const salt = await bcrypt.genSalt(saltRounds);
        const hash = await bcrypt.hash(password, salt);
        return hash;
    } catch (err) {
        console.log(err);
    }
}

// nodemailer stuff

const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
    host: 'smtp.gmail.com',
    port: 465,
    secure: true,
    auth: {
        user: 'phamhoangsang199@gmail.com',
        pass: 'xdcgthijilzzvpnz',
    }
});

// getAllUsers

async function getAllUsers() {
    try {
        const users = await user.find();
        return users;
    } catch (err) {
        console.log(err);
    }
}

// login handler hash password

async function login(username, password) {
    try {
        const users = await user.findOne({ username: username });
        if (users) {
            const isMatch = await bcrypt.compare(password, users.password);
            if (isMatch) {
                return users;
            } else {
                return null;
            }
        }
    } catch (err) {
        console.log(err);
    }
}

// register user

async function register(username, password, score, positionX, positionY, positionZ) {
    try {
        // check if user already registered
        const checks = await user.findOne({ username: username });
        if (checks) {
            return null;
        }
        // hash the password
        password = await hashPassword(password);
        let users = new user({ username: username, password: password, score: score, positionX: positionX, positionY: positionY, positionZ: positionZ });
        await users.save();
        console.log("Insert Successfull")
        // hash the password
    } catch (err) {
        console.log(err);
    }
}
// save score
async function savescore(username, score) {
    try {
        const updatedUser = await user.findOneAndUpdate(
            { username: username }, // tìm kiếm bản ghi với username tương ứng
            { $set: { score: score } }, // cập nhật trường score cho bản ghi đó
            { new: true } // trả về bản ghi đã được cập nhật
        );
        if (updatedUser) {
            return updatedUser;
        } else {
            return false;
        }
    } catch (error) {
        console.error("error updating score: " + error);
    }
}
// send otp
async function sendOTP(username) {
    try {
        const users = await user.findOne({ username: username });
        if (users) {
            let otps = '';
            let userOTPRecord = await userOTP.findOne({ username: username });
            if (userOTPRecord) {
                otps = `${Math.floor(1000 + Math.random() * 9000)}`;
                userOTPRecord.otp = otps;
                userOTPRecord.createAt = Date.now();
                userOTPRecord.expireAt = Date.now() + 360000;
                await userOTPRecord.save();
            } else {
                otps = `${Math.floor(1000 + Math.random() * 9000)}`;
                const newOTP = new userOTP({
                    username: username,
                    otp: otps,
                    createAt: Date.now(),
                    expireAt: Date.now() + 360000,
                })
                await newOTP.save();
            }
            // mail options
            const mailOptions = {
                from: process.env.AUTH_EMAIL,
                to: username,
                subject: 'OTP for your account',
                text: `Your OTP is ${otps}`
            };
            // send the otp to the user
            await transporter.sendMail(mailOptions);
            console.log("OTP sent successfully")
            return users;
        } else {
            return false;
        }
    } catch (err) {
        console.log(err);
    }
}

// verifyOTP hash password

async function verifyOTP(username, otp, newpassword) {
    try {
        const userRsOTP = await userOTP.findOne({ username: username, otp: otp });
        if (userRsOTP && userRsOTP.username === username && userRsOTP.otp === otp) {
            password = await hashPassword(newpassword);
            const updatedUser = await user.findOneAndUpdate(
                { username: username }, // tìm kiếm bản ghi với username tương ứng
                { $set: { password: password } }, // cập nhật trường score cho bản ghi đó
                { new: true } // trả về bản ghi đã được cập nhật
            );
            console.log("verifyPassword successfull");
            await userOTP.findOneAndDelete({ username: username });
            return updatedUser;
        } else {
            console.log("verifyPassword failed");
            return false;
        }
    } catch (err) {
        console.log(err);
    }
}

// change password from old password to new password and as username

async function changePassword(username, oldpassword, newpassword) {
    try {
        const users = await user.findOne({ username: username });
        if (users) {
            const isMatch = await bcrypt.compare(oldpassword, users.password);
            if (isMatch) {
                password = await hashPassword(newpassword);
                const updatedUser = await user.findOneAndUpdate(
                    { username: username }, // tìm kiếm bản ghi với username tương ứng
                    { $set: { password: password } }, // cập nhật trường score cho bản ghi đó
                    { new: true } // trả về bản ghi đã được cập nhật
                );
                console.log("changePassword successfull");
                return updatedUser;
            } else {
                console.log("changePassword failed");
                return false;
            }
        } else {
            console.log("changePassword failed 2");
            return false;
        }
    } catch (e) {

    }
}

// save position as save score

async function savePosition(username, positionX, positionY, positionZ) {
    try {
        // check if user already exists
        const checks = await user.findOne({ username: username });
        if (checks) {
            const updatedUser = await user.findOneAndUpdate(
                { username: username }, // tìm kiếm bản ghi với username tương ứng
                { $set: { positionX: positionX, positionY: positionY, positionZ: positionZ } }, // cập nhật trường score cho bản ghi đó
                { new: true } // trả về bản ghi đã được cập nhật
            );
            return true;
        } else {
            return false;
        }
        // hash the password
    } catch (error) {
        console.error("error updating score: " + error);
    }
}

module.exports = { login, register, savescore, sendOTP, verifyOTP, changePassword, savePosition, getAllUsers }