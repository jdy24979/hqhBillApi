const express = require('express');
const mysql = require('mysql');
let db = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '$$pass1234',
    database: 'hqhdb',
    multipleStatements:true
});
module.exports=function() {
    var router = express.Router();

    router.use("/productSelect",function(req,res){
        let queryStr ="SELECT * FROM pv_product;";
        // console.log(queryStr)
        db.query(queryStr,(err,data) => {
            if(err){
                res.send({code:1})
                res.end();
            }else{
                let resData = [];
                for (let index = 0; index < data.length; index++) {
                    const element = data[index];
                    resData.push({value:element.id,label:element.name})
                }
                res.send({code:0,list:resData}).end();
            }
        })
    })

    router.use("/productList",function(req,res){
        let queryStr ="SELECT * FROM pv_product WHERE `name` LIKE '\%" + (req.body.name == null ? "" :req.body.name) + "\%' AND `order` LIKE '\%" + (req.body.order == null ? "" :req.body.order) + "\%'";
        // console.log(queryStr)
        db.query(queryStr,(err,data) => {
            if(err){
                res.send({code:1})
                res.end();
            }else{
                res.send({code:0,list:data}).end();
            }
        })
    })
    
    router.use("/productAdd",function(req,res){
        let info = req.body;
        let queryStr ='INSERT INTO `pv_product`(`name`,`order`) VALUES (\'' +   info.name + "','" + info.order + "')";
        // console.log(queryStr)
        db.query('SELECT * FROM `pv_product` WHERE `name` LIKE \'' + info.name + "';" ,(err,data)=> {
            if(err){
                // console.log('SELECT * FROM `pv_product` WHERE `name` LIKE ' + info.name + "';")
                return res.send({code:1}).end();
            }else{
                if(data.length != 0){
                    return res.send({code:2,msg:"产品名称重复"})
                }else{
                    db.query(queryStr,(err,data) => {
                        // console.log(queryStr)
                        if(err){
                            return res.send({code:1}).end();
                        }else{
                            res.send({code:0,msg:"新增成功"}).end();
                        }
                    })
                }
            }
        }) 
    })

    router.use("/productDelete",function(req,res){
        let ids = String(req.body.ids);
        let queryStr ='DELETE FROM `pv_product` WHERE `id` in ('+ ids +') ; DELETE FROM `pv_model` WHERE `product_id` in (' + ids + ') ; DELETE FROM `pv_spec` WHERE `product_id` in (' + ids + ');';
        db.query(queryStr,(err,data)=> {
            if(err){
                return res.send({code:1}).end();
            }else{
                return res.send({code:0,msg:"删除成功"}).end();
            }
        }) 
    })

    router.use("/productPut",function(req,res){
        let info = req.body;
        let queryStr ="UPDATE `pv_product` SET `name` = '"+ info.name + "',`order` = '"+ info.order +"' WHERE `id` = "+ info.id;
        db.query(queryStr,(err,data)=> {
            if(err){
                return res.send({code:1}).end();
            }else{
                return res.send({code:0,msg:"修改成功"}).end();
            }
        }) 
    })

    return router
}