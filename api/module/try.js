function fn() {
    try {
        // console.log(aa)
        // throw "跑出一个异常"
    }
    catch (err) {
        console.log(111,err)
    }
    finally {
        console.log("我管你是谁，反正我是我")
    }
};
fn()