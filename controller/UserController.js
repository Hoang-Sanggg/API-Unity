const user = require('../models/user');

async function getAll() {
    try {
        let users = await user.find({});
        return users;
    } catch (err) {
        console.log(err);
    }
}

async function insert(username, password, score, positionX, positionY, positionZ) {
    try {
        let users = new user({ username: username, password: password, score: score, positionX: positionX, positionY: positionY, positionZ: positionZ });
        await users.save();
        console.log("Insert Successfull")
    } catch (err) {
        console.log(err);
    }
}

async function updateUser(username, score) {
    try {
        const updatedUser = await user.findOneAndUpdate(
            { username: username }, // tìm kiếm bản ghi với username tương ứng
            { $set: { score: score } }, // cập nhật trường score cho bản ghi đó
            { new: true } // trả về bản ghi đã được cập nhật
        );
        return updatedUser;
    } catch (error) {
        console.error("error updating score: " + error);
    }
}

module.exports = { getAll, insert, updateUser }