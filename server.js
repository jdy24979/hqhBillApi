const express = require('express');
const expressStatic = require('express-static');
const bodyParser = require('body-parser');
const compression = require('compression');
const expressSession = require('express-session');
const cookieParser = require('cookie-parser');


let serve = express();

serve.listen(8080);

serve.use(compression())

serve.use(cookieParser());

serve.use(expressSession({
    'resave': false,
    'saveUninitialized': true,
    'secret': 'ruidoc',
    'cookie': {
        'maxAge': 90000
    },
    'name': 'session_id'
}));

serve.use(bodyParser.json({}));

serve.use('/', function (req, res, next) {
    if (!req.session.user && req.url.indexOf('/login') == -1 && req.url.indexOf('/static') == -1) {
        return res.redirect('/login');
    } else {
        if (req.url.indexOf('/home/') != -1 && req.url == "/index") {
            return res.redirect('/');
        }
        if (req.url == "/") {
            return res.sendFile(__dirname + '/dist/index.html');
        }

    }
    next();
})

serve.use('/login',function(req,res){
    return res.sendFile(__dirname + '/dist/login/index.html');
})

serve.use('/api/login', require('./api/login/login')());

serve.use('/api/menu', require('./api/menu/menu')());

serve.use('/api/billTotal', require('./api/bill/total')());

serve.use('/api/billList', require('./api/bill/list')());

serve.use('/api/billDetail', require('./api/bill/detail')());

serve.use('/api/product', require('./api/product/product')());

serve.use('/api/model', require('./api/product/model')());

serve.use('/api/spec', require('./api/product/spec')());

serve.use('/api/storehouse', require('./api/storehouse/storehouse')());

serve.use('/static' ,expressStatic('./dist'));



