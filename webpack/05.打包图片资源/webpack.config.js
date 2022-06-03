//这一part语法得去看最新文档
const {resolve}=require("path");
const HtmlWebpackPlugin=require("html-webpack-plugin")
module.exports={
    entry:"./src/index.js",
    output:{
        filename:"built.js",
        path:resolve(__dirname,"build")
    },
    module:{
        rules:[
            {
                test:/\.less$/,
                //要使用多个loader处理用use
                use:[
                    "style-loader",
                    "css-loader",
                    "less-loader"
                ]
            },
            {
                //处理图片资源
                test:/\.(jpg|png|gif)$/,
                //使用一个loader
                //下载url-loader file-loader
                loader:"url-loader",
                options:{
                    //图片大小小于8kb，就会被base64处理
                    //优点：减少请求数量，减轻服务器压力
                    //缺点：图片体积会更大，文件请求速度更慢
                    limit:8*1024
                    //问题：因为url-loader默认使用es6模块化解析，而html-loader引入图片是commonjs
                    //解析时会出问题
                    //解决：关闭url-loader的es6模块化，使用commonjs解析
                    //esModule:false
                }
            },
            {
                test:/.\html$/,
                //处理html文件的img图片(负责引入Img,从而能被url-loader进行处理)
                loader:"html-loader"
            }
        ]
    },
    plugins:[
        new HtmlWebpackPlugin({
            template: "./src/index.html"
        })
    ],
    mode:"development"
}