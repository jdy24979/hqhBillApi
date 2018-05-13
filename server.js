

const express = require('express');
const expressStatic = require('express-static');
const bodyParser = require('body-parser');
const mysql = require('mysql');

let db = mysql.createConnection({
    host     : 'localhost',
    user     : 'root',
    password : '$$pass1234',
    database : 'hqhdb'
});

db.connect();

let serve = express();

serve.listen(8080);



// serve.use("*",function(req,res,next){
//     res.header("Access-Control-Allow-Origin", "*");
//     next();
// })

serve.use(bodyParser.json({}));

serve.use('/api/billTotal/list',function(req,res){
    let queryStr = 'SELECT * FROM `bill_t` WHERE `name` LIKE \'%' + req.body.name + '%\' AND (' + ( req.body.type == null ? null :"'"+req.body.type+"'" ) + " is null  or  type = '" + req.body.type +"');";
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

serve.use('/api/billTotal/select',function(req,res){
    let queryStr = 'SELECT * FROM `bill_t` WHERE `id` = ' + req.body.id ;
    // console.log(queryStr)
    db.query(queryStr,(err,data)=>{
        if(err){
            res.send({code:1})
        }else{
            res.send(data[0])
        }
        res.end();
    })
})

serve.use('/api/billTotal/add',function(req,res){
    let info = req.body;
    let queryStr = 'INSERT INTO bill_t(name,type,settled,unsettled,total) VALUES (\''+
                        info.name + "','"+ info.type +"',0,0,0"
                    +')';
    // console.log(queryStr);
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

serve.use('/api/billList/List',function(req,res){
    let queryStr = 'SELECT * FROM `bill_list` WHERE `rela_t_id` = '
                    + req.body.rela_t_id +
                    ' AND `name` LIKE \'%'
                    + req.body.name + 
                    '%\' AND (' 
                    + ( req.body.status == null ? null :"'"+req.body.status+"'" ) + 
                    " is null  or  status = '" 
                    + req.body.status +
                    "') AND `tel` LIKE \'%"
                    + req.body.tel +
                    "%' AND `description` LIKE '%"
                    + req.body.description +
                    "%' ORDER BY `id` DESC;";
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

serve.use('/api/billList/changeStatus',function(req,res){
    let ids = req.body.ids;
    let faId = req.body.faId;
    let date = new Date()
    let queryStr = 'UPDATE bill_list SET status = \'已结算\' , settle_date = \''+ date.Format('YYYY-M-D') +'\' WHERE id in (' +ids.toString() +');';
    db.query(queryStr,(err)=>{
        if(err){
            res.send({code:1});
            res.end();
        }else{
            db.query(upDateTotalSql(faId),(err) => {
                if(err){
                    res.send({code:2})
                }else{
                    res.send({code:0})
                }
                res.end();
            })
        }
        
    })
})

serve.use('/api/billList/add',function(req,res){
    const details = req.body.detail;
    let info = req.body.addInfo;
    let queryStr = 'INSERT INTO bill_list(name,type,status,amount,tel,date,description,rela_t_id) VALUES (\''+
                        info.name + "','"+ info.type +"','未结算','"+ info.amount +"','"+ info.tel +"','"+ new Date(info.date).Format("YYYY-M-d") +"','"+ info.description +"','"+ info.rela_t_id +"'"
                    +')';
    db.query(queryStr,(err)=>{
        if(err){
            res.send({code:1});
            res.end();
        }else{
            db.query('SELECT * from bill_list where id ORDER BY id DESC LIMIT 1',(err,data) => {
                if(err){
                    res.send({code:3});
                    res.end();
                }else{
                    let faId = data[0].id;
                    let queryStr = "";
                    for (let i = 0; i < details.length; i++) {
                        const element = details[i];
                        queryStr += 'INSERT INTO bill_detail(product_name,model_name,number,unit,rela_l_id) VALUES (\''+
                                        element.product_name + "','"+ element.model_name +"','"+ element.number +"','"+ element.unit +"','"+ faId +"'"
                                    +');';
                    }
                    // console.log(queryStr)
                    db.query(queryStr,(err) =>{
                        if (err) {
                            res.send({code:2});
                            res.end();
                        }else{
                            res.send({code:0});
                            res.end();
                        }
                    })
                }
            })
        }
        
    })
})

serve.use("/api/billDetail/list",function(req,res){
    let faId = req.body.id;
    let queryStr ="SELECT * FROM `bill_detail` WHERE `rela_l_id` = " + faId;
    console.log(queryStr)
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

function upDateTotalSql(id){
    return 'UPDATE bill_t\
    SET total = (\
        SELECT\
            count(1)\
        FROM\
            bill_list\
        WHERE\
            rela_t_id = ' + id +
    '),\
     settled = (\
        SELECT\
            count(1)\
        FROM\
            bill_list\
        WHERE\
            STATUS = \'已结算\'\
        AND rela_t_id = ' + id +
    '),\
     unsettled = (\
        SELECT\
            count(1)\
        FROM\
            bill_list\
        WHERE\
            STATUS = \'未结算\'\
        AND rela_t_id = ' + id +
    ')\
    WHERE\
        id = ' + id + ';';
}

Date.prototype.Format =  function(formatStr){
    var str = formatStr;
    var Week = ['日','一','二','三','四','五','六'];

    str=str.replace(/yyyy|YYYY/,this.getFullYear());
    str=str.replace(/yy|YY/,(this.getYear() % 100)>9?(this.getYear() % 100).toString():'0' + (this.getYear() % 100));

    str=str.replace(/MM/,this.getMonth()>9?this.getMonth().toString():'0' + this.getMonth());
    str=str.replace(/M/g,Number(this.getMonth())+1);

    str=str.replace(/w|W/g,Week[this.getDay()]);

    str=str.replace(/dd|DD/,this.getDate()>9?this.getDate().toString():'0' + this.getDate());
    str=str.replace(/d|D/g,this.getDate());

    str=str.replace(/hh|HH/,this.getHours()>9?this.getHours().toString():'0' + this.getHours());
    str=str.replace(/h|H/g,this.getHours());
    str=str.replace(/mm/,this.getMinutes()>9?this.getMinutes().toString():'0' + this.getMinutes());
    str=str.replace(/m/g,this.getMinutes());

    str=str.replace(/ss|SS/,this.getSeconds()>9?this.getSeconds().toString():'0' + this.getSeconds());
    str=str.replace(/s|S/g,this.getSeconds());

    return str; 
}

serve.use(expressStatic('./dist'));