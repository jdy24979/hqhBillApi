const express = require('express');
const expressStatic = require('express-static');
const bodyParser = require('body-parser');
const mysql = require('mysql');

var db = mysql.createConnection({
    host     : 'localhost',
    user     : 'root',
    password : '$$pass1234',
    database : 'hqhdb'
});

db.connect();

var serve = express();

serve.listen(8080);



serve.use("*",function(req,res,next){
    res.header("Access-Control-Allow-Origin", "*");
    next();
})

serve.use(bodyParser.json({}));

serve.use('/api/billTotal/list',function(req,res){
    var queryStr = 'SELECT * FROM `bill_t` WHERE `name` LIKE \'%' + req.body.name + '%\' AND (' + ( req.body.type == null ? null :"'"+req.body.type+"'" ) + " is null  or  type = '" + req.body.type +"');";
    // console.log(queryStr)
    db.query(queryStr,(err,data)=>{
        if(err){
            res.send({errCode:1})
        }else{
            res.send(data)
        }
        res.end();
    })
})

serve.use('/api/billTotal/add',function(req,res){
    var info = req.body;
    var queryStr = 'INSERT INTO bill_t(name,type,settled,unsettled,total) VALUES (\''+
                        info.name + "','"+ info.type +"',0,0,0"
                    +')';
    console.log(queryStr);
    db.query(queryStr,(err,data)=>{
        if(err){
            res.send({code:1})
        }else{
            res.send({
                code:0,
                msg:"新增成功"
            })
        }
        res.end();
    })
})

serve.use(expressStatic('./dist'));