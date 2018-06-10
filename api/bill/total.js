const express = require('express');
const mysql = require('mysql');
let db = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '$$pass1234',
    database: 'hqhdb'
});
module.exports=function() {
    var router = express.Router();

    router.use('/list', function (req, res) {
        let queryStr = 'SELECT * FROM `bill_t` WHERE `name` LIKE \'%' + req.body.name + '%\' AND (' + (req.body.type == null ? null : "'" + req.body.type + "'") + " is null  or  type = '" + req.body.type + "');";
        // console.log(queryStr)
        db.query(queryStr, (err, data) => {
            if (err) {
                res.send({ errCode: 1 })
            } else {
                res.send(data)
            }
            res.end();
        })
    })

    router.use('/select', function (req, res) {
        let queryStr = 'SELECT * FROM `bill_t` WHERE `id` = ' + req.body.id;
        // console.log(queryStr)
        db.query(queryStr, (err, data) => {
            if (err) {
                res.send({ code: 1 })
            } else {
                res.send(data[0])
            }
            res.end();
        })
    })

    router.use('/add', function (req, res) {
        let info = req.body;
        let queryStr = 'INSERT INTO bill_t(name,type,settled,unsettled,total) VALUES (\'' +
            info.name + "','" + info.type + "',0,0,0"
            + ')';
        // console.log(queryStr);
        db.query(queryStr, (err, data) => {
            if (err) {
                res.send({ code: 1 })
            } else {
                res.send({
                    code: 0,
                    msg: "新增成功"
                })
            }
            res.end();
        })
    })

    return router
}