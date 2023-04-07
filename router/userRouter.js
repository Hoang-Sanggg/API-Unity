const express = require('express');
const router = express.Router();
const UserController = require('../controller/UserController');

router.post('/login', async function (req, res) {
    let user = await UserController.getAll();
    let Users = null;

    for (let i = 0; i < user.length; i++) {
        const currentUser = user[i];
        if (currentUser.username === req.body.username && currentUser.password === req.body.password) {
            Users = currentUser;
            break;
        }
    }

    if (!Users) {
        res.send({
            status: 1,
            notification: "Sai tài khoản hoặc mật khẩu"
        });
    } else {
        res.send({
            status: 1,
            notification: "Đăng nhập thành công",
            username: Users.username,
            score: Users.score,
            positionX: Users.positionX,
            positionY: Users.positionY,
            positionZ: Users.positionZ
        });
    }
});

// Register

router.post('/register', async (req, res) => {
    let user = await UserController.getAll();
    let Users = null;
    for (let i = 0; i < user.length; i++) {
        const currentUser = user[i];
        if (currentUser.username === req.body.username) {
            Users = currentUser;
            break;
        }
    }

    if (!Users) {
        let username = req.body.username;
        let password = req.body.password;

        // kiểm tra tên tài khoản có phải email hay không
        if (!username.endsWith('@gmail.com')) {
            res.send({
                status: 0,
                notification: "Username phải là email"
            });
            return;
        }

        try {
            await UserController.insert(username, password, "", "", "", "");
            res.send({
                status: 1,
                notification: "Đăng kí thành công"
            });
        } catch (err) {
            console.log(err);
            res.send({
                status: 0,
                notification: "Đăng kí không thành công"
            });
        }
    } else {
        res.send({
            status: 0,
            notification: "Tên tài khoản đã tồn tại"
        });
    }
});



module.exports = router;