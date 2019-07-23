const express = require("express");
const bodyParser = require('body-parser');
const help = require("./module/help");
const db = require("./module/db")
const app = express();
app.use(bodyParser.json());
app.use(express.static(__dirname+"/weibo"))
app.all("*",function (req,res,next) {
    res.header("Access-Control-Allow-Origin","*");
    res.header("Access-Control-Allow-Headers","content-type");
    next();
})
app.post("/weibo",function (req,res) {
    db.insertOne("contextList",{
        context:req.body.context,
        topNum:0,
        downNum:0,
        addTime:Date.now()
    },function (err,results) {
        if(err) help.json(res);
        else help.json(res,1,"成功");
    })
    // db._connect(function (db) {
    //     db.collection("contextList").insertOne({
    //         context:req.body.context,
    //         topNum:0,
    //         downNum:0,
    //         addTime:help.getNowTime()
    //     },function (err,reuslts) {
    //         if(err) help.json(res);
    //         else help.json(res,1,"成功");
    //     })
    // })
});
app.get("/weibo",function (req,res) {
    /*分页  最终是要返回指定页的内容。
    * 1、pageIndex  代表的是第几页
    * 2、求出总页数
    * */
    let pageIndex = (req.query.pageIndex || 1)/1;
    let limit = 5;// 每页显示的条数
    let pageSum = 1;// 总页数，初始值设为1;
    db.count("contextList",{},function (count) {
        pageSum = Math.ceil(count/limit);// 总页数
        if(pageSum < 1) pageSum = 1;
        if(pageIndex > pageSum) pageIndex = pageSum;
        if(pageIndex < 1) pageIndex = 1;
        db.find("contextList",{
            skip:(pageIndex-1)*limit,
            limit,
            sortObj:{
                addTime:-1
            }
        },function (err,contextList) {
            if(err) help.json(res);
            else res.json({
                ok:1,
                contextList,
                pageIndex,
                pageSum,
                msg:"成功"
            })
        })


    })

    // db._connect(function (db) {
    //     db.collection("contextList").find().sort({addTime:-1}).toArray(function (err,contextList) {
    //         if(err) help.json(res);
    //         else res.json({
    //             ok:1,
    //             contextList,
    //             msg:"成功"
    //         })
    //     })
    // })
});
app.delete("/weibo/:id",function (req,res) {
    db.deleteOneById("contextList",req.params.id,function (err,reuslts) {
        if(err) help.json(res);
        else help.json(res,1,"删除成功")
    })
})
app.put("/weibo/:id",function (req,res) {
    let id = req.params.id;
    let type = req.body.type/1;
    let $inc = {
        topNum:1
    }
    if(type !== 1){
        $inc={
            downNum:1
        }
    }

    db.updateOneById("contextList",id,{
        $inc
    },function (err,results) {
        if(err) help.json(res);
        else help.json(res,1,"修改成功")
    })

})


app.listen(80,function () {
    console.log("success");
})

