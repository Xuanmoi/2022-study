//1.引入fs模块
const fs=require("fs");

const p = new Promise((resolve,reject)=>{
    fs.readFile("./resources/test.md",(err,data)=>{
        if(err) reject(err);
        resolve(data.toString());
    });
});

p.then(value=>{
    return new Promise((resolve,reject)=>{
        fs.readFile("./resources/book1.md",(err,data)=>{
            if(err) reject(err);
            resolve([value,data.toString()]);
        })
    })
},reason=>{
    console.err(reason);
}).then(value=>{
    return new Promise((resolve,reject)=>{
        fs.readFile("./resources/book2.md",(err,data)=>{
            if(err) reject(err);
            //压入
            value.push(data.toString())
            resolve(value);
        })
    })
},reason=>{
    console.err(reason);
}).then(value=>{
    console.log(value);
})