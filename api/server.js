const express = require("express");
const jwt = require("./module/jwt");
const bodyParser = require("body-parser");
const db = require("./module/db");
const help = require("./module/help");
const upPic = require("./module/upPic");
const app = express();
const fs = require("fs")
app.use(bodyParser.json());
//将upload设为静态资源
app.use(express.static(__dirname+"/upload"))
//
app.get("/list",function (req,res) {
    res.json({
        ok:1,
        msg:"list"
    })
})
//登录
app.post("/login",function (req,res) {
    const {adminName,passWord} = req.body;
    // console.log(req.body);
    // console.log("我看看你是谁",req)
    setTimeout(()=>{
        db.findOne("adminList",{//在数据库中查看是否有用户名和密码
            adminName,
            passWord:help.md5(passWord)
        },function (err,adminInfo) {//验证是否有值
            if(adminInfo){
                // console.log(adminInfo)
                db.insertOne("adminLog",{
                    adminName,
                    loginTime:Date.now()
                },function (err) {
                    // 登陆成功
                    res.json({//返回的，在浏览器中console控制台能查看的到数据
                        ok:1,
                        msg:"登陆成功",
                        adminName,
                        token:jwt.encode(adminName)
                    })
                })

            }else{
                // console.log(121212);
                // 登陆失败
                help.json(res);
            }
        })
    },1000)

});

//允许多个路由同时访问一个页面，可以直接复制代码使用
app.all("*",function (req,res,next) {//可接受多个回调函数作为路由处理器，往往要处理请求和响应。path匹配完整路径，接受正则，匹配所有方法，执行顺序按照顺序。
    const token = req.headers.authorization;
    const info = jwt.decode(token);
    // console.log("token",info);
    if(info.ok < 1){
        res.json({
            ok:-2,// token验证失败。
            msg:info.msg
        })
    }else{
        next();
    }
});
//token
app.get("/token",function (req,res) {
    // console.log(1111111);
    res.json({
        ok:1,
        msg:"验证成功"
    })
})
//管理员日志
app.get("/adminLog",function (req,res) {
    // const token = req.headers.authorization;
    // const info = jwt.decode(token);
    // if(info.ok < 1){
    //     res.json({
    //         ok:-2,// token验证失败。
    //         msg:info.msg
    //     })
    // }else{
    let pageIndex = req.query.pageIndex/1;

    let adminName = req.query.adminName;
    let whereObj = {};
    if(adminName){
        whereObj = {
            adminName:new RegExp(adminName)
        }
    }
    db.count("adminLog",whereObj,function (count) {
        let pageNum = 6
        // 页数
        let pageSum = Math.ceil(count/pageNum) ;
        if(pageSum<1) pageSum = 1;
        if(pageIndex<1) pageIndex=1;
        if(pageIndex>pageSum) pageIndex = pageSum;

        db.find("adminLog",{
            limit:pageNum,
            skip:(pageIndex-1)*pageNum,
            whereObj,
            sortObj:{
                loginTime:-1
            }
        },function (err,adminLog) {
            setTimeout(()=>{
            res.json({
                ok:1,
                pageIndex,
                pageSum,
                adminLog
            })
            },100)
        })
    })
    // }
})
//修改管理员密码
app.put("/adminLog",function (req,res) {
    // console.log(req.body);
    const {token,passWord,NewPassWord} = req.body;
    // console.log(req.body)
    const {info,ok,msg} = jwt.decode(token)
    // console.log(jwt.decode(token))
    if(ok === 1){
        console.log(111)
        db.findOne("adminList",{
            adminName:info.adminName
        },function (err,passInfo) {
            console.log(passInfo);
            if(passInfo.passWord===help.md5(passWord)){
                db.updateOneById("adminList",passInfo._id,{
                    $set:{
                        passWord:help.md5(NewPassWord)
                    }
                },function (err) {
                    res.json({//返回的，在浏览器中console控制台能查看的到数据
                        ok:1,
                        msg:"修改成功",
                        adminName,
                        token:jwt.encode(adminName)
                    })
                })
            }else {
                // console.log(121212);
                // 登陆失败
                help.json(res);
            }
        })
    }
}),
//删除管理员登录日志
app.delete("/adminLog/:id",function (req,res) {
    const id = req.params.id;
    db.findOneById("adminLog",id,function (err,info) {
        db.deleteOneById("adminLog",id,function (err) {
            help.json(res,1,"删除成功")
        })
    })
})

app.post("/addShopType",function (req,res) {
    console.log(1212121212);
    upPic(req,"shopTypePic",function (obj) {
        db.insertOne("shopTypeList",{
            shopTypeName:obj.params.shopTypeName,
            shopTypePic:obj.params.newPicName,
            addTime:Date.now()
        },function (err,resutls) {
            help.json(res,1,'成功')
        })
        // console.log(obj);
        // res.json(obj);
       }
    )
})
app.get("/shopTypeList",function (req,res) {
    let pageIndex = req.query.pageIndex/1;
    db.count("shopTypeList",{},function (count) {
        let pageNum = 6
        // 页数
        let pageSum = Math.ceil(count/pageNum) ;
        if(pageSum<1) pageSum = 1;
        if(pageIndex<1) pageIndex=1;
        if(pageIndex>pageSum) pageIndex = pageSum;

        db.find("shopTypeList",{
            limit:pageNum,
            skip:(pageIndex-1)*pageNum,
            sortObj:{
                addTime:-1
            }
        },function (err,shopTypeList) {
            setTimeout(()=>{
            res.json({
                ok:1,
                pageIndex,
                pageSum,
                shopTypeList
            })
            },100)
        })
    })
})
app.delete("/shopTypeList/:id",function (req,res) {
    const id = req.params.id;
    db.findOneById("shopTypeList",id,function (err,info) {
        fs.unlink(__dirname+"/upload/"+info.shopTypePic,function () {
            db.deleteOneById("goodsList",id,function (err) {
                if(err) help.json(err);
                else {
                    db.deleteOneById("shopTypeList",id,function (err,results) {
                        help.json(res,1,"删除成功")
                    })
                }
            })
        })
    })
})
app.get("/allShopTypeList",function (req,res) {
    console.log(11111);
    db.find("shopTypeList",{
        sortObj:{
            addTime:-1
        }
    },function (err,shopTypeList) {
        res.json({
            ok:1,
            shopTypeList
        })
    })
})
//店铺
app.post("/addShop",function (req,res) {
    upPic(req,"shopPic",function (obj) {
        db.findOneById("shopTypeList",obj.params.shopTypeId,function (err,shopTypeInfo) {
            db.insertOne("shopList",{
                shopName:obj.params.shopName,
                shopPic:obj.params.newPicName,
                shopTypeId:obj.params.shopTypeId,// ObjectId  mongodb.ObjectId()
                shopTypeName:shopTypeInfo.shopTypeName,
                addTime:help.getNowTime()
            },function (err) {
                help.json(res,1,"添加成功 ")
            })
        })
    })
})
app.get("/shopList",function (req,res) {
    let pageIndex = req.query.pageIndex/1;
    db.count("shopList",{},function (count) {
        let pageNum = 6
        // 页数
        let pageSum = Math.ceil(count/pageNum) ;
        if(pageSum<1) pageSum = 1;
        if(pageIndex<1) pageIndex=1;
        if(pageIndex>pageSum) pageIndex = pageSum;

        db.find("shopList",{
            limit:pageNum,
            skip:(pageIndex-1)*pageNum,
            sortObj:{
                addTime:-1
            }
        },function (err,shopList) {
            setTimeout(()=>{
                res.json({
                    ok:1,
                    pageIndex,
                    pageSum,
                    shopList
                })
            },100)
        })
    })
})
app.get("/shopList/:shopTypeId",function (req,res) {
    db.find("shopList",{
        sortObj:{
            addTime:-1
        },
        whereObj: {
            shopTypeId: req.params.shopTypeId
        }
    },function (err,shopList) {
        res.json({
            ok:1,
            shopList
        })
    })
});
//商品类别
app.get("/goodsType",function (req,res) {
    let pageIndex = req.query.pageIndex/1;
    db.count("goodsTypeList",{},function (count) {
        let pageNum = 6
        // 页数
        let pageSum = Math.ceil(count/pageNum) ;
        if(pageSum<1) pageSum = 1;
        if(pageIndex<1) pageIndex=1;
        if(pageIndex>pageSum) pageIndex = pageSum;

        db.find("goodsTypeList",{
            limit:pageNum,
            skip:(pageIndex-1)*pageNum,
            sortObj:{
                addTime:-1
            }
        },function (err,goodsTypeList) {
            setTimeout(()=>{
                res.json({
                    ok:1,
                    pageIndex,
                    pageSum,
                    goodsTypeList
                })
            },100)
        })
    })
});
app.post("/goodsTypeList",function (req,res) {
    const {goodsTypeName,shopId,shopTypeId}=req.body;
    db.findOneById("shopTypeList",shopTypeId,function (err,shopTypeInfo) {
        db.findOneById("shopList",shopId,function (err,shopInfo) {
            db.insertOne("goodsTypeList",{
                goodsTypeName,
                shopId,
                shopListName:shopInfo.shopName,
                shopTypeId:shopInfo.shopTypeId,
                shopTypeName:shopTypeInfo.shopTypeName,
                addTime:Date.now()
            },function (err) {
                if(err){
                    help.json(res,-1,"添加失败")
                }else {
                    help.json(res,1,"添加成功")
                }
            })
        })
    })
});
app.delete("/goodsTypeList/:id",function (req,res) {
    const id = req.params.id
    db.findOneById("goodsTypeList",id,function (err,info) {
        db.deleteOneById("goodsTypeList",id,function (err) {
            help.json(res,1,"删除成功")
        })
    })
});

//根据店铺id获取商品类型列表
app.get("/getGoodsTypeById/:id",function (req,res) {
    const whereObj = {
        shopId:req.params.id
    }
    db.find("goodsTypeList",{
        whereObj
    },function (err,goodsTypeList) {
        if(err) help.json(res,-1,"获取失败")
        else {
            res.json({
                ok:1,
                msg:'获取成功',
                goodsTypeList
            })
        }
    })
})
//请求商品信息
app.post("/addGoods",function (req,res) {
    upPic(req,"goodsListPic",function (obj) {
        db.findOneById("shopTypeList",obj.params.shopTypeId,function (err,shopTypeInfo) {
            // console.log(111,shopTypeInfo)
            db.findOneById("shopList",obj.params.shopId,function (err,shopIdInfo) {
                // console.log(222,shopIdInfo)
                db.findOneById("goodsTypeList",obj.params.goodsTypeId,function (err,goodsTypeInfo) {
                    // console.log(333,goodsTypeInfo)
                    db.insertOne("goodsList",{
                        goodsListName:obj.params.goodsName,
                        goodsTypeId:goodsTypeInfo._id,
                        shopId:shopIdInfo._id,
                        shopName:shopIdInfo.shopName,
                        shopTypeId:shopTypeInfo._id,
                        shopTypeName:shopTypeInfo.shopTypeName,
                        goodsTypeName:goodsTypeInfo.goodsTypeName,
                        goodsListPic:obj.params.newPicName,
                        addTime:Date.now()
                    },function (err) {
                        if(err){
                            help.json(res,-1,"添加失败")
                        }else {
                            help.json(res,1,"添加成功")
                        }
                    })
                })
            })
        })
    })
})
//获取商品信息
app.get("/goodsList",function (req,res) {
    let pageIndex = req.query.pageIndex/1;
    db.count("goodsList",{},function (count) {
        let pageNum = 6
        // 页数
        let pageSum = Math.ceil(count/pageNum) ;
        if(pageSum<1) pageSum = 1;
        if(pageIndex<1) pageIndex=1;
        if(pageIndex>pageSum) pageIndex = pageSum;

        db.find("goodsList",{
            limit:pageNum,
            skip:(pageIndex-1)*pageNum,
            sortObj:{
                addTime:-1
            }
        },function (err,goodsList) {
            setTimeout(()=>{
                res.json({
                    ok:1,
                    pageIndex,
                    pageSum,
                    goodsList
                })
            },100)
        })
    })
})
app.delete("/goodsList/:id",function (req,res) {
    const id = req.params.id
    db.findOneById("goodsList",id,function (err,info) {
        db.deleteOneById("goodsList",id,function (err) {
            // console.log(_id)
            help.json(res,1,"删除成功")
        })
    })
})


app.listen(80,function () {
    console.log("success");
})