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

    router.use("/login",function(req,res){
        let username = req.body.username;
        let password = req.body.password;
        let queryStr ="SELECT * FROM `user` WHERE `user` = " + username;
        // console.log(queryStr)
        db.query(queryStr,(err,data) => {
            if(err){
                res.send({code:1})
                res.end();
            }else{
                console.log(data);
                res.send({code:0,list:data})
                res.end();
            }
        })
    })

    return router
}