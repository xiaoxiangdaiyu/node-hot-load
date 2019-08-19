//中间件，实现监听文件及重启操作
var watch = require('watch')
var cp = require('child_process')
var path = require('path')
var appIns = cp.fork(path.join(__dirname, './src/app.js'));
function handelChange(){
    appIns.kill('SIGINT')
    return cp.fork(path.join(__dirname, './src/app.js'))
}

function wacthDir(app,dir){
    watch.watchTree(__dirname + '/views',function(f,cur,prev){
        // 非初始
        if (!!prev){
            console.log('in change')
            appIns = handelChange('isChange') 
        }
    })  
}
process.on('SIGINT', () => {
   process.exit(0);
});

wacthDir()