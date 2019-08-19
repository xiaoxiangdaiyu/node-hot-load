var sendevent = require('sendevent');
var chokidar = require('chokidar');
var uglify = require('uglify-js');
var fs = require('fs');
var ENV = process.env.NODE_ENV || 'development'; 
var test = require('./views/say.js')
var watch = null

var polyfill = fs.readFileSync(__dirname + '/eventsource-polyfill.js', 'utf8');
var clientScript = fs.readFileSync(__dirname + '/scripts.js', 'utf8');
// 获得js代码，压缩之后插入html
var script = uglify.minify(polyfill + clientScript).code;
function cleanCache(moduleId){
    var path = require.resolve(moduleId)
    // 删除缓存
    // require.cache[path] = null
    // 看来null 不行，需要删除
    delete require.cache[path]
    // 再重新请求？
    test = require(moduleId)
}
var reload = function(app,dir){
    if(ENV === 'production'){
        app.locals.watchScript = ''
        return;
    }
    if(!watch){
        watch = chokidar.watch(dir)
    }
    var events = sendevent('/eventstream')
    app.use(events);
    watch.on('change', function (path) {
        // 首次不刷新
            console.log(path)
            // js变化
            if (path.match('.js')){
                cleanCache(path)
                test()
            }
            events.broadcast({
                msg: 'reload'
            });
    });
    app.locals.watchScript = '<script>' + script + '</script>' ;
}

module.exports = reload