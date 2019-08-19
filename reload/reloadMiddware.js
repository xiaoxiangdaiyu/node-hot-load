//中间件，实现监听文件及重启操作
var chokidar = require('chokidar');
var cp = require('child_process')
var path = require('path')
var appIns = cp.fork(path.join(__dirname, './src/app.js'));
var watch = null

function handelChange(){
    appIns.kill('SIGINT')
    return cp.fork(path.join(__dirname, './src/app.js'))
}

function wacthDir(){
    if (!watch) {
        watch = chokidar.watch(__dirname+'/views')
    }
    watch.on('change',function(path){
        console.log('file change>>>', path)
        appIns = handelChange('isChange')
    }) 
}
process.on('SIGINT', () => {
   process.exit(0);
});

wacthDir()