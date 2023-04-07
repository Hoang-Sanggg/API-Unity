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

module.exports = { getAll, insert }