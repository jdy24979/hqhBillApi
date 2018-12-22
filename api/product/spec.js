const express = require('express');
const mysql = require('mysql');
let db = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '$$pass1234',
    database: 'hqhdb',
    multipleStatements: true
});
module.exports = function () {
    var router = express.Router();

    router.use("/specList", function (req, res) {
        let queryStr = "SELECT * FROM `spec` WHERE `product_name` LIKE '\%" + (req.body.productName == null ? "" : req.body.productName) + "\%' AND `model_name` LIKE '%" + (req.body.modelName == null ? "" : req.body.modelName) + "%' AND `spec_name` LIKE '%" + (req.body.specName == null ? "" : req.body.specName) + "%' AND `order` LIKE '\%" + (req.body.order == null ? "" : req.body.order) + "\%'";
        db.query(queryStr, (err, data) => {
            if (err) {
                res.send({ code: 1 })
                res.end();
            } else {
                res.send({ code: 0, list: data }).end();
            }
        })
    })

    router.use("/specAdd", function (req, res) {
        let info = req.body;
        let queryStr = 'INSERT INTO `pv_spec`(`name`,`order`,`product_id`,`model_id`) VALUES (\'' + info.specName + "','" + info.specOrder + "','" + info.productId + "','" + info.modelId + "')";
        // console.log(queryStr)
        db.query('SELECT * FROM `pv_spec` WHERE `name` LIKE \'' + info.name + "' AND `model_id` = " + info.modelId + ";", (err, data) => {
            if (err) {
                // console.log('SELECT * FROM `pv_spec` WHERE `name` LIKE ' + info.name + "';")
                return res.send({ code: 1 }).end();
            } else {
                if (data.length != 0) {
                    return res.send({ code: 2, msg: "规格名称重复" })
                } else {
                    db.query(queryStr, (err, data) => {
                        // console.log(queryStr)
                        if (err) {
                            return res.send({ code: 1 }).end();
                        } else {
                            res.send({ code: 0, msg: "新增成功" }).end();
                        }
                    })
                }
            }
        })
    })

    router.use("/specDelete", function (req, res) {
        let ids = String(req.body.ids);
        let queryStr = 'DELETE FROM `pv_spec` WHERE `id` in (' + ids + ');';
        db.query(queryStr, (err, data) => {
            if (err) {
                return res.send({ code: 1 }).end();
            } else {
                return res.send({ code: 0, msg: "删除成功" }).end();
            }
        })
    })

    router.use("/specPut", function (req, res) {
        let info = req.body;
        let queryStr = "UPDATE `pv_spec` SET `name` = '" + info.specName + "',`order` = '" + info.specOrder + "' WHERE `id` = " + info.id;
        db.query(queryStr, (err, data) => {
            if (err) {
                return res.send({ code: 1 }).end();
            } else {
                return res.send({ code: 0, msg: "修改成功" }).end();
            }
        })
    })

    router.use("/export", function (req, res) {
        let queryStr = "SELECT * FROM `spec` WHERE `product_name` LIKE '\%" + (req.body.productName == null ? "" : req.body.productName) + "\%' AND `model_name` LIKE '%" + (req.body.modelName == null ? "" : req.body.modelName) + "%' AND `spec_name` LIKE '%" + (req.body.specName == null ? "" : req.body.specName) + "%' AND `order` LIKE '\%" + (req.body.order == null ? "" : req.body.order) + "\%' ORDER BY `order`";
        db.query(queryStr, (err, data) => {
            if (err) {
                res.send({ code: 1 })
                res.end();
            } else {
                var str = '产品,型号,规格,进价,售价,库存/n'
                for (let i = 0; i < data.length; i++) {
                    const element = data[i];
                    str += data[i].product_name+','+data[i].model_name+','+data[i].spec_name+',,,/n';
                }
                console.log(str)
                res.end(str);
            }
        })
    })

    return router
}