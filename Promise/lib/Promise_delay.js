/*
自定义Promise函数模块:IIFE
 */

(function (window){
    const PENDDING="pendding";
    const RESOLVED="resolved";
    const REJECTED="rejected";
    /*
    Promise构造函数
    excutor:执行器函数(同步执行)
     */
    function Promise(excutor){
        //将当前promise对象保存起来
        const self=this ;
        self.status=PENDDING;//给promise对象指定status属性，初始值为pending
        self.data=undefined;//给promise对象指定一个用于存储结果数据的属性
        self.callbacks=[];//每个元素的结构：{onResolved(){},onRejected(){}}
        //立即同步执行excutor
        function resolve(value){
            //如果当前状态不是pendding，直接结束
            if(self.status!=PENDDING) return;
            //将状态改为resolved
            self.status=RESOLVED;
            //保存value数据
            self.data=value;
            //如果有待执行callback函数，立即异步执行回调函数
            if(self.callbacks.length>0){
                setTimeout(()=>{ //放入队列中执行回调函数中所有的成功的回调
                    self.callbacks.forEach(calbacksObj=>{
                        calbacksObj.onResolved(value);
                    })
                })
            }
        }
        function reject(reason){
            //如果当前状态不是pendding，直接结束
            if(self.status!=PENDDING) return;
            //将状态改为rejected
            self.status=REJECTED;
            //保存reason数据
            self.data=reason;
            //如果有待执行callback函数，立即异步执行回调函数
            if(self.callbacks.length>0){
                setTimeout(()=>{ //放入队列中执行回调函数中所有的失败的回调
                    self.callbacks.forEach(calbacksObj=>{
                        calbacksObj.onRejected(reason);
                    })
                })
            }
        }
        //立即执行执行器
        try{
            excutor(resolve,reject);
        }catch(error){
            reject(error);//如果执行器抛出异常，promise对象变为rejected状态
        }
            
        
    }
    /**
     * Promise原型对象的then()
     * 指定成功和失败的回调函数
     * 返回一个新的promise对象
     */
    Promise.prototype.then=function(onResolved,onRejected){
        const self=this;
        onResolved=typeof onResolved==="function"?onResolved:value=>value;
        onRejected=typeof onRejected==="function"?onRejected:reason=>{throw reason};//异常传透 指定默认的失败的回调
        //返回一个新的promise对象
        return new Promise((resolve,reject)=>{
            //调用指定的函数回调处理
            //调用指定回调函数处理，根据执行结果，改变return的promise的状态
            function handle(callback){
                try{
                    const result=callback(self.data);
                    if(result instanceof Promise){
                        //3.如果回调函数返回的是promise，return的promise结果就是这个promise的结果
                        // result.then(
                        //     value=>{
                        //         resolve(value);//当result成功时，让return的promise也成功
                        //     },
                        //     reason=>{
                        //         reject(reason);//当result失败时，让return的promise也失败
                        //     }
                        // )
                        result.then(resolve,reject);//会自动传入参数
                    }else{
                        //2.如果回调函数返回的不是promise，return的promise就会成功，value就是返回的值
                        resolve(result);
                    }
                }catch(e){
                    //1.如果抛出异常，return的promise就会失败，reason就是error
                    reject(e);
                }
            }
            if(self.status==PENDDING){
                //当前状态还是pendding状态，将回调函数保存起来
                self.callbacks.push({
                    onResolved(value){
                        handle(onResolved);
                    },
                    onRejected(reason){
                        handle(onRejected);
                    }
                })
            }else if(self.status==RESOLVED){//如果当前是resolved状态，异步执行onResolved并改变return的promise状态
                setTimeout(()=>{
                    handle(onResolved);
                });
            }else{//如果当前是rejected状态，异步执行onRejected并改变return的promise状态
                setTimeout(()=>{
                    handle(onRejected);
                });
            } 
        })
    }

    /**
     * Promise原型对象的catch()
     * 指定失败的回调函数
     * 返回一个新的promise对象 
     */
    Promise.prototype.catch=function(onRejected){
        return this.then(undefined,onRejected);
    }

    /**
     * Promise函数对象的方法：resolve
     * 返回一个指定结果的成功的promise
     */
    Promise.resolve = function(value){
        //返回一个成功/失败的promise
        return new Promise((resolve,reject)=>{
            //value是promise
            if(value instanceof Promise){//使用value的结果作为promise的结果
                value.then(resolve,reject);
            }else{//value不是promise =>promise变为成功 数据是value
                resolve(value);
            }
        })
    }
    /**
     * Promise函数对象的方法：reject
     * 返回一个指定结果的失败的promise
     */
    Promise.reject = function(reason){
        //返回一个失败的promise
        return new Promise((resolve,reject)=>{
            reject(reason)
        })
    }
    /**
     * Promise函数对象的方法：all
     * 返回一个promise,只有当所有promise都成功时才成功，否则失败
     */
    Promise.all=function(promises){
        return new Promise((resolve,reject)=>{
            //遍历promises获取每个promise的结果
            const values=new Array(promises.length);//用来保存所有成功的value的数组
            let resolvedCount=0;
            promises.forEach((p,index)=>{
                Promise.resolve(p).then(
                    value=>{//p成功，将成功的value保存values里
                        resolvedCount++;
                        values[index]=value;
                        //如果全部成功了，将return的promise改为成功
                        if(resolvedCount==promises.length){
                            resolve(values);
                        }
                    },
                    reason=>{//只要一个失败了，return的promise就失败
                        reject(reason)
                    }
                )
            })
        })
    }
    /**
     * Promise函数对象的方法：race
     * 返回一个promise,其结果由第一个完成的promise决定
     */
    Promise.race=function(promises){
        return new Promise((resolve,reject)=>{
            promises.forEach((p,index)=>{
                Promise.resolve(p).then(
                    value=>{
                        resolve(value);
                    },
                    reason=>{
                        reject(reason);
                    }
                )
            })

        })
    }

    Promise.resolveDelay=function(value,time){
        return new Promise((resolve,reject)=>{
            setInterval(function(){
                if(value instanceof Promise){
                    value.then(resolve,reject);
                }else{
                    resolve(value);
                }
            },time);
        })
    }

    Promise.rejectDelay=function(reason,time){
        //返回一个失败的promise
        return new Promise((resolve,reject)=>{
            setTimeout(function(){
                reject(reason);
            },time);
        })
    }


    //向外暴露Promise函数
    window.Promise=Promise;
})(window)