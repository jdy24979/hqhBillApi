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

    router.use("/list",function(req,res){
        let queryStr ="SELECT * FROM `view_storehouse` WHERE `product_name` LIKE '\%" + (req.body.productName == null ? "" :req.body.productName) + "\%' AND `model_name` LIKE '%"+ (req.body.modelName == null ? "" :req.body.modelName) +"%' AND `spec_name` LIKE '%"+ (req.body.specName == null ? "" :req.body.specName) +"%' AND `order` LIKE '\%" + (req.body.order == null ? "" :req.body.order) + "\%' ORDER BY `order`";
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
    
    router.use("/goodsInList",function(req,res){
        let queryStr ="SELECT * FROM `view_goods_in` WHERE `product_name` LIKE '\%" + (req.body.productName == null ? "" :req.body.productName) + "\%' AND `model_name` LIKE '%"+ (req.body.modelName == null ? "" :req.body.modelName) +"%' AND `spec_name` LIKE '%"+ (req.body.specName == null ? "" :req.body.specName) +"%' AND `order` LIKE '\%" + (req.body.order == null ? "" :req.body.order) + "\%' ORDER BY `order`";
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

    router.use("/goodsInAdd",function(req,res){
        let info = req.body;
        let queryStr ="INSERT INTO `goods_in` (`spec_id`,`unit_price`,`t_price`,`tax`,`invoice`,`number`,`update_date`) VALUES ('" +   info.specId + "','" + info.unitPrice + "','"+ info.TPrice +"','"+ info.tax +"','"+ info.invoice +"','"+ info.number +"','"+ info.updateDate +"');"
                      //"UPDATE INTO `goods_in` (`spec_id`,`unit_price`,`t_price`,`tax`,`invoice`,`number`,`update_date`) VALUES ('" +   info.specId + "','" + info.unitPrice + "','"+ info.TPrice +"','"+ info.tax +"','"+ info.invoice +"','"+ info.number +"','"+ info.updateDate +");
        console.log(queryStr)
        // db.query(queryStr,(err,data) => {
        //     if(err){
        //         res.send({code:1})
        //         res.end();
        //     }else{
        //         res.send({code:0,list:data}).end();
        //     }
        // })
    })

    return router
}