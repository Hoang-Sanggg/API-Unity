// const User = require('../models/user');
// const UserOTP = require('../models/userOTP');
// const bcrypt = require('bcryptjs');
// const nodemailer = require('nodemailer');

// const saltRounds = 10;
// const transporter = nodemailer.createTransport({
//     host: 'smtp.gmail.com',
//     port: 465,
//     secure: true,
//     auth: {
//         user: 'phamhoangsang199@gmail.com',
//         pass: 'xdcgthijilzzvpnz',
//     }
// });

// async function hashPassword(password) {
//     const salt = await bcrypt.genSalt(saltRounds);
//     return await bcrypt.hash(password, salt);
// }

// async function login(username, password) {
//     const user = await User.findOne({ username });
//     return user && await bcrypt.compare(password, user.password) ? user : null;
// }

// async function register(username, password, score, positionX, positionY, positionZ) {
//     if (await User.findOne({ username })) {
//         return null;
//     }
//     const hashedPassword = await hashPassword(password);
//     const user = new User({
//         username,
//         password: hashedPassword,
//         score,
//         positionX,
//         positionY,
//         positionZ
//     });
//     await user.save();
//     console.log("Insert Successfull");
// }

// async function updateUser(username, score) {
//     return await User.findOneAndUpdate(
//         { username },
//         { $set: { score } },
//         { new: true }
//     );
// }

// async function sendOTP(username) {
//     const user = await User.findOne({ username });
//     if (!user) {
//         return false;
//     }
//     const otp = `${Math.floor(1000 + Math.random() * 9000)}`;
//     const userOTPRecord = await UserOTP.findOne({ username });
//     if (userOTPRecord) {
//         userOTPRecord.otp = otp;
//         userOTPRecord.createAt = Date.now();
//         userOTPRecord.expireAt = Date.now() + 360000;
//         await userOTPRecord.save();
//     } else {
//         const newOTP = new UserOTP({
//             username,
//             otp,
//             createAt: Date.now(),
//             expireAt: Date.now() + 360000,
//         });
//         await newOTP.save();
//     }
//     const mailOptions = {
//         from: process.env.AUTH_EMAIL,
//         to: username,
//         subject: 'OTP for your account',
//         text: `Your OTP is ${otp}`
//     };
//     await transporter.sendMail(mailOptions);
//     console.log("OTP sent successfully");
//     return user;
// }

// async function verifyOTP(username, otp, newpassword) {
//     const userOTPRecord = await UserOTP.findOne({ username, otp });
//     if (!userOTPRecord || userOTPRecord.username !== username || userOTPRecord.otp !== otp) {
//         console.log("verifyPassword failed");
//         return false;
//     }
//     const user = await User.findOneAndUpdate(
//         { username },
//         { $set: { password: newpassword } },
//         { new: true }
//     );
//     console.log("verifyPassword successful");
//     await UserOTP.findOneAndDelete({ username });
//     return user;
// }

// async function changePassword(username, oldpassword, newpassword) {
//     const user = await User.findOne({ username });
//     if (!user || !await bcrypt.compare(oldpassword, user.password)) {
//         return false;
//     }
//     const hashedNewPassword = await hashPassword(newpassword);
//     return await User.findOneAndUpdate(
//         { username },
//         { $set: { password: hashedNewPassword } },
//         { new: true }
//     );
// }

// module.exports = { login, register, updateUser, sendOTP, verifyOTP, changePassword }