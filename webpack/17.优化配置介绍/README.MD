#webpack性能优化
*开发环境性能优化
*生产环境性能优化

##开发环境性能优化
* 优化打包构建速度
    * HMR 
* 优化代码调试
    * source-map

## 生产环境性能优化
* 优化打包构建速度 
    * oneOf
    * babel缓存
    * 多进程打包
    * externals
    * dll
* 优化代码运行的性能
    * 缓存（hash->chunkhash->contenthash）
    * tree shaking
    * code split
    * 懒加载/预加载
    * PWA
    
HMR：hot module replacement 热模块替换/模块热替换

作用：一个模块发生变化，只会重新打包这一个模块（而不是打包所有模块）
    极大提升构建速度
    devServer里 hot:ture
    //当修改了webpack的配置，需要重启webpack

    样式文件：可以使用HMR功能，因为style-loader内部实现了
    js文件:默认不能使用HMR功能-->需要修改JS代码，添加支持HMR功能的代码
        注意：HMR功能对JS的处理，只能处理非入口JS文件的其他文件。
        if(module.hot){
            //一旦module.hot为true,说明开启了HMR功能-->让HMR功能代码生效
            module.hot.accept("./print.js",function(){
                //方法会监听print.js文件的变化，一旦发生变化，其他模块不会重新打包构建
                //会执行后面的回调函数
                print();
            })
        }
    html文件:默认不能使用HMR功能，同时会导致问题：Html文件不能热更新了（不用做HMR功能）
            解决:修改entry入口，将html文件引入

source-map:一种提供源代码到构建后代码映射的技术（如果构建后代码出错了，通过映射可以追踪源代码错误）
    devtool:"source-map"
    [inline-|hidden-|eval-][nosources-][cheap-[module]]source-map

    source-map:外部
        错误代码的准确信息 和 源代码的错误位置
        精确到列
    inline-source-map:内联
        1.只生成一个内联source-map
        错误代码的准确信息 和 源代码的错误位置
    hidden-source-map:外部
        错误代码的错误原因，但是没有错误位置
        不能追踪源代码错误，只能提示到构建后代码的错误位置
    eval-source-map:内联
        1.每一个文件都生成一个内联source-map,都在eval
        错误代码的准确信息 和 源代码的错误位置
    nosource-source-map:外部
        错误代码的准确信息，但是没有任何源代码信息
    cheap-source-map:外部
        错误代码的准确信息 和 源代码的错误位置
        只能精确到行
    cheap-module-source-map:外部
        错误代码的准确信息 和 源代码的错误位置
    内联和外部的区别：1.外部生成了文件，内联没有。2.内联构建速度更快

    开发环境：速度快，调试更友好
        速度快（eval>inline>cheap>...）
        eval-cheap-source-map
        eval-source-map
        调试更友好（source-map>cheap-module-source-map>cheap-source-map）
        -->eval-source-map/eval-cheap-module-source-map
    生产环境：源代码要不要隐藏2？调试要不要更友好？
        内联会让代码体积变大，所以生产环境是使用外部
        隐藏：nosoureces-source-map 全部隐藏
            hidden-source-map 只隐藏源代码，会提示构建后代码错误信息
        调试:source-map
        -->source-map/cheap-module-source-map

oneOf:以下loader只会匹配一个，注意：不能有两个配置处理同一种类型文件

缓存：
    babel缓存
        cacheDirectory:true //开启babel缓存，第二次构建时，会读取之前的缓存，速度会更快些
    文件资源缓存
        hash：每次webpack构建时会生成一个唯一的hash值
            问题：因为JS和CSS同时使用一个hash值，如果重新打包，会导致所有缓存失效（可能我只改动了一个文件）
        chunkhash:根据chunk生产的hash值。如果打包来源于同一个chunk，那么hash值就一样
            问题：js和css的hash值还是一样的
            因为css是在js中被引入的，所以同属于一个chunk
        contenthash：根据文件的内容生成hash值。不同的文件内容hash不一样。
        -->让代码上线运行缓存更好使用

tree shaking:去除无用代码
    前提：1.必须使用ES6模块化代码 2.开启production环境
    作用：减少代码体积

    在package.json中配置
    "sideEffects":false 所有代码都没有副作用（都可以进行tree shaking）
    问题：可能会把css / @babel/polyfill 文件干掉
    解决方法："sideEffects":["*.css",".less"]//这样.css /.less文件就不会被tree shaking了

code split
    /*
     单入口 多入口 这个用的比较少
    */
    /*
    1.可以将node_modules中代码单独打包一个chunk最终输出
    2.自动分析多入口chunk中，有没有公共的文件，如果有会打包成一个单独的一个chunk
    */
    optimization:{
        splitChunks:{
            chunks:"all"
        }
    }

    /*
    通过JS代码，让某个文件被单独打包成一个chunk
    Import动态导入语法：能将某个文件单独打包
    */
    import(/* webpackChunkName:'test' */"./test")
    .then((res)=>{
        //文件加载成功
        //eslint-disable-next-line
        console.log(res)
    })
    .catch(()=>{
        //eslint-disable-next-line
        console.log("文件加载失败");
    })

lazy loading:
    懒加载:当文件需要使用时才加载
    预加载：会在使用之前，提前加载JS文件
    正常加载可以认为是并行加载，同一时间加载多个文件 预加载：等其他资源加载完毕，浏览器空闲了，再偷偷加载资源

PWA：渐进式网络开发应用程序（离线可访问）
    workbox->workbox-webpack-plugin

多进程打包:thread-loader //开启多进程打包
    //进程启动大概600ms,进程通信也有开销
    //只有工作消耗时间比较长，才需要多进程打包

externals：//拒绝指定包被打包进去
dll:使用dll技术，对某些库（第三方库：jquery,react,vue...）进行单独打包
    当你运行webpack时，默认查找webpack.config.js配置文件
    需求：需要运行webpack.dll.js文件
    -->webpack --config webpack.dll.js