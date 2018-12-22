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

    router.use("/modelSelect",function(req,res){
        let info = req.body;
        let queryStr ="SELECT * FROM `model` WHERE `product_id` = " +info.productId;
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

    router.use("/modelList",function(req,res){
        let info = req.body;
        let queryStr ="SELECT * FROM `model` WHERE `product_name` LIKE '%"+ info.productName +"%' AND `model_name` LIKE '%"+ info.modelName +"%' AND `order` LIKE '%"+ info.order +"%'";
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
    
    router.use("/modelAdd",function(req,res){
        let info = req.body;
        let queryStr ='INSERT INTO `pv_model`(`name`,`order`,`product_id`) VALUES (\'' +   info.modelName + "','" + info.modelOrder + "',"+ info.productId +")";
        // console.log(queryStr)
        db.query('SELECT * FROM `pv_model` WHERE `name` LIKE \'' + info.modelName + "' AND `product_id` = "+ info.productId +";" ,(err,data)=> {
            if(err){
                // console.log('SELECT * FROM `pv_model` WHERE `name` LIKE ' + info.name + "';")
                return res.send({code:1}).end();
            }else{
                if(data.length != 0){
                    return res.send({code:2,msg:"型号名称重复"})
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

    router.use("/modelDelete",function(req,res){
        let ids = String(req.body.ids);
        let queryStr ='DELETE FROM `pv_model` WHERE `id` in ('+ ids +') ; DELETE FROM `pv_spec` WHERE `model_id` in (' + ids + ');';
        db.query(queryStr,(err,data)=> {
            if(err){
                return res.send({code:1}).end();
            }else{
                return res.send({code:0,msg:"删除成功"}).end();
            }
        }) 
    })

    router.use("/modelPut",function(req,res){
        let info = req.body;
        let queryStr ="UPDATE `pv_model` SET `name` = '"+ info.modelName + "',`order` = '"+ info.modelOrder +"' WHERE `id` = "+ info.id;
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