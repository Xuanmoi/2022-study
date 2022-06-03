//1.引入fs模块
const fs=require("fs");

//读取book1
function readBook1(){
    return new Promise((resolve,reject)=>{
        fs.readFile("./book/book1.md",(err,data)=>{
            if(err) reject(err);
            resolve(data);
        });
    })
}
//读取book2
function readBook2(){
    return new Promise((resolve,reject)=>{
        fs.readFile("./book/book2.md",(err,data)=>{
            if(err) reject(err);
            resolve(data);
        });
    })
}
//读取book2
function readBook3(){
    return new Promise((resolve,reject)=>{
        fs.readFile("./book/book2.md",(err,data)=>{
            if(err) reject(err);
            resolve(data);
        });
    })
}
//声明一个async函数
async function main(){
    //获取书籍内容
    let book1=await readBook1();
    let book2=await readBook2();
    let book3=await readBook3();
    console.log(book1.toString());
    console.log(book2.toString());
    console.log(book3.toString());
}
main();