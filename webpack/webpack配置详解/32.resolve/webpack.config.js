const {resolve}=require("path");
const HtmlWebpackPlugin=require("html-webpack-plugin")

/**
 * 
 */
module.exports={
    entry:"./src/js/index.js",
    output:{
        //文件名称（指定名称+目录）
        filename:"js/[name].js",
        //输出文件目录（将来所有资源输出的公共目录）
        path:resolve(__dirname,"build"),
    },
    module:{
        rules:[
            //loader的配置
            {
                test:/\.css$/,
                //多个Loader用use
                use:["style-loader","css-loader"]
            }
        ]
    },
    plugins:[
        new HtmlWebpackPlugin()
    ],
    mode:"development",
    //解析模块的规则
    resolve:{
        //配置解析模块路径别名：优点：简写路径 缺点：路径没有提示
        alias:{
            $css:resolve(__dirname,"src/css")
        },
        //配置省略文件路径的后缀名
        extensions:['.js','.json',".css"],
        //告诉webpack解析模块是去找哪个目录
        modules:[resolve(__dirname,"../../node_modules"),"node_modules"]
    }
}