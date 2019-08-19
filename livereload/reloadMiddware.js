var sendevent = require('sendevent');
var chokidar = require('chokidar');
var uglify = require('uglify-js');
var fs = require('fs');
var ENV = process.env.NODE_ENV || 'development'; 
var watch = null


var polyfill = fs.readFileSync(__dirname + '/eventsource-polyfill.js', 'utf8');
var clientScript = fs.readFileSync(__dirname + '/scripts.js', 'utf8');
// 获得js代码，压缩之后插入html
var script = uglify.minify(polyfill + clientScript).code;
var reload = function(app,dir){
    if(ENV === 'production'){
        app.locals.watchScript = ''
        return;
    }
    if (!watch) {
        watch = chokidar.watch(dir)
    }
    var events = sendevent('/eventstream')
    app.use(events);
    watch.on('change', function (path) {
        console.log('file change>>>',path)
        events.broadcast({
            msg: 'reload'
        });
    });
    app.locals.watchScript = '<script>' + script + '</script>' ;
}

module.exports = reload