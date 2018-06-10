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

    router.use("/list",function(req,res){
        let faId = req.body.id;
        let queryStr ="SELECT * FROM `bill_detail` WHERE `rela_l_id` = " + faId;
        // console.log(queryStr)
        db.query(queryStr,(err,data) => {
            if(err){
                res.send({code:1})
                res.end();
            }else{
                res.send({code:0,list:data})
                res.end();
            }
        })
    })

    return router
}