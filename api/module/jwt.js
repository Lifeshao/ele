const jwt = require("jwt-simple");//安装
const key = "1@#!@#!$12"  //key
module.exports = {
    encode(adminName,exp=1999999999999999999999999999999999*1000) {//用来验证还有多长时间到期
        return jwt.encode({//生成token
            adminName,
            exp:Date.now()+exp
        },key)
    },
    decode(token){//解析
        try {
            const info = jwt.decode(token,key);//解析token
            if(info.exp>Date.now()){//判断时间是否过期       -----未过期
                return{
                    ok:1,
                    msg:"成功",
                    info
                }
            }else{
                return{
                    ok:-1,
                    msg:"过期"
                }
            }
        }
        catch(err){
           return ({
                id:-1,
                msg:"解析失败"
            })
        }
    }
}