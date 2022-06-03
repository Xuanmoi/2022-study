const {resolve}=require("path");
const HtmlWebpackPlugin=require("html-webpack-plugin")

/**
 * entry:入口起点
 *  1.string --> "./src/index.js"
 *      单入口
 *      打包形成一个chunk，输出一个bundle文件
 *      此时chunk的名称默认是main （当filename:"[name].js"时）
 *  2.array
 *      多入口
 *      所有入口文件最终只会形成一个chunk，输出出去只会有一个Bundle
 *      -->只有在HMR功能中让Html热更新生效
 *  3.object
 *      多入口
 *      有几个入口文件就形成几个chunk，输出几个Bundle文件
 *      此时chunk名称是Key
 * 
 *      -->特殊用法 结合着用
 */
module.exports={
    //entry:"./src/index.js"
    //entry:["./src/index.js","./src/add.js"],
    //entry:{index:"./src/index.js",add:"./src/add.js"},
    entry:{
        index:["./src/index.js","./src/count.js"],
        add:"./src/add.js"},
    output:{
        filename:"[name].js",
        path:resolve(__dirname,"build")
    },
    plugins:[
        new HtmlWebpackPlugin()
    ],
    mode:"development"
}