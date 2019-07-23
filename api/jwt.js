const jwt = require("jwt-simple");
//生成 加密token
//jwt。encode 第一个参数（荷载（payload）生成token的信息）  第二个参数key:密钥
const key = "213!@#!@$#@$";
const token = jwt.encode({//个人需要登录信息
    adminName:"admin",
    exp:Date.now()+10*60*1000,//token的过期时间
},key);
console.log(token);//加密好的
//解析,验证token是否正确jwt.decode(token,key) 返回值为你荷载时添加的内容
console.log(jwt.decode(token,key))