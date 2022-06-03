// import * as m1 from "./hello.js"

// let btn=document.getElementById("btn");
// btn.onclick=function(){
//     m1.hello();
// }

let btn=document.getElementById("btn");
btn.onclick=function(){
    import("./hello.js").then(module=>{
        module.hello();
    })
}