//import add from "./add";
import count from "./count";
import("./add").then(({default:add})=>{
    console.log(add(1,2))
})
console.log("index.js was loaded");
console.log(count(4,2));