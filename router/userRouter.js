const express = require('express');
const router = express.Router();
const UserController = require('../controller/UserController');

router.get('/getAll', async function (req, res) {
    // get all users
    let result = await UserController.getAllUsers();
    res.send(JSON.stringify(result));
});

router.post('/login', async function (req, res) {
    let username = req.body.username;
    let password = req.body.password;
    let Users = await UserController.login(username, password);
    if (!Users) {
        res.send({
            status: 0,
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
        const result = await UserController.register(username, password, "", "", "", "");
        result ? res.send({
            status: 1,
            notification: "Đăng kí thành công"
        }) : res.send({
            status: 0,
            notification: "Tài khoản đã được đăng kí trước đó"
        })
    } catch (err) {

    }
    // if (!Users) {

    // } else {
    //     res.send({
    //         status: 0,
    //         notification: "Tên tài khoản đã tồn tại"
    //     });
    // }
});

router.post('/savescore', async (req, res) => {
    let username = req.body.username;
    let score = req.body.score;
    try {
        const result = await UserController.savescore(username, score);
        result ? res.send({
            status: 1,
            notification: "Lưu thành công"
        }) : res.send({
            status: 0,
            notification: "Lưu thất bại"
        });
    } catch (err) {
        console.log(err);
    }
});

router.post('/sendOTP', async (req, res) => {
    let username = req.body.username;
    // use UserController.sendOTP
    try {
        const result = await UserController.sendOTP(username);
        if (result) {
            res.send({
                status: 1,
                notification: "Gửi thành công"
            });
        } else {
            res.send({
                status: 0,
                notification: "Tên tài khoản không tồn tại"
            });
        }
    } catch (err) {
        console.log(err);

    }
})
// verify otp email address

router.post('/verifyOTP', async (req, res) => {
    let username = req.body.username;
    let otp = req.body.otp;
    let newpassword = req.body.newpassword;
    try {
        const updatedUser = await UserController.verifyOTP(username, otp, newpassword);
        if (updatedUser) {
            res.send({
                status: 1,
                notification: "Reset Password Success",
            });
        } else {
            res.send({
                status: 0,
                notification: "Không đúng OTP"
            });
        }
    } catch (err) {
        console.log(err);
        res.send({
            status: 0,
            notification: "Đăng nhập thất bại"
        });
    }
})

// save positon 

router.post('/savePosition', async (req, res) => {
    let username = req.body.username;
    let positionX = req.body.positionX;
    let positionY = req.body.positionY;
    let positionZ = req.body.positionZ;
    try {
        const result = await UserController.savePosition(username, positionX, positionY, positionZ);
        result ? res.send({
            status: 1,
            notification: "Lưu thành công"
        }) : res.send({
            status: 0,
            notification: "Lưu thất bại"
        })
    } catch (err) {
        console.log(err);

    }
})

// change password

router.post('/changePassword', async (req, res) => {
    let username = req.body.username;
    let oldpassword = req.body.oldpassword;
    let newpassword = req.body.newpassword;
    try {
        const result = await UserController.changePassword(username, oldpassword, newpassword);
        result ? res.send({
            status: 1,
            notification: "Đổi mật khẩu thành công"
        }) : res.send({
            status: 0,
            notification: "Đổi mật khẩu không thành công"
        })
    } catch (err) {
        console.log()
    }
})


module.exports = router;