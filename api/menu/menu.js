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
        let queryStr ="SELECT *,sub_menu.name as sub_name,sub_menu.id as sub_id,sub_menu.nameEn as sub_nameEn FROM `sub_menu` left join `menu` on sub_menu.rela_id = menu.id";
        // console.log(queryStr)
        db.query(queryStr,(err,data) => {
            if(err){
                res.send({code:1})
                res.end();
            }else{
                let menuData = [];
                let menus = [];
                let ids = [];
                for (let i = 0; i < data.length; i++) {
                    const element = data[i];
                    if(ids.indexOf(element.rela_id) == -1){
                        ids.push(element.rela_id);
                        menus.push({
                            id:element.rela_id,
                            name:element.name,
                            nameEn:element.nameEn,
                            icon:element.icon,
                            subList:[]
                        })
                    }  
                }
                for(let i in menus){
                    for (let index = 0; index < data.length; index++) {
                        const element = data[index];
                        if(element.rela_id == menus[i].id){
                            menus[i].subList.push({
                                name:element.sub_name,
                                id:element.sub_id,
                                nameEn:element.sub_nameEn
                            })
                        }
                    }
                }
                res.send({code:0,list:menus})
                res.end();
            }
        })
    })

    return router
}