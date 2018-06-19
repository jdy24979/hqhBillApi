const express = require('express');
const mysql = require('mysql');
let db = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '$$pass1234',
    database: 'hqhdb'
});
module.exports = function () {
    var router = express.Router();

    router.use("", function (req, res) {
        console.log(req.body)
        let username = req.body.username;
        let password = req.body.password;
        let queryStr = "SELECT * FROM `user` WHERE `user` = '" + username + "'";
        console.log(queryStr)
        db.query(queryStr, (err, data) => {
            if (err) {
                res.send({ code: 1 }).end();
            } else {
                if (data.length == 0) {
                    res.send({ code: 2, msg: '用户名不存在' }).end();
                } else {
                    if (data[0].password == password) {
                        req.session.user = data[0].id;
                        res.send({
                            code: 0,
                            username: data[0].user,
                            userId: data[0].id,
                            msg: "登录成功"
                        }).end()
                    } else {
                        res.send({ code: 2, msg: '密码错误' }).end();
                    }
                }

            }
        })
    })

    return router
}