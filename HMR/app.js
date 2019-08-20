var express = require('express');
var app = express();
var ejs = require('ejs');
var path = require('path');
var reloadMiddleware = require('./reloadMiddware');

var PORT = 8082;
// 引入
reloadMiddleware(app, __dirname + '/views') 
//  设置渲染引擎
app.engine('html', ejs.renderFile); 
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'html'); 
app.get('/', function (req, res) {
    res.render('home');
}); 
app.get('/js', function (req, res) {
    var { callback} = req.query
    var test = require('./views/say')
    console.log(`test>>>`, test())
    let data = {
        msg: test()
    }
    data = JSON.stringify(data)
    res.end(`${callback}(${data})`)
}); 
app.listen(PORT); 
console.log(`it is listen on ${PORT}`)