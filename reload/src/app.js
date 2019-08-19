var express = require('express');
var app = express();
var ejs = require('ejs');
var path = require('path');
var PORT = 8081;

//  设置渲染引擎
app.engine('html', ejs.renderFile);
app.set('views', path.join(__dirname, '../views'));
app.set('view engine', 'html');
console.log(app.locals.watchScript)
app.get('/', function (req, res) {
    res.render('home');
});
app.listen(PORT);
console.log(`it is listen on ${PORT}`)