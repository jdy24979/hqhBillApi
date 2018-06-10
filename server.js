const express = require('express');
const expressStatic = require('express-static');
const bodyParser = require('body-parser');
const expressRoute = require('express-route');
const compression = require('compression');


let serve = express();

serve.listen(8080);

serve.use(compression())

serve.use(bodyParser.json({}));

serve.use('/api/menu', require('./api/menu/menu')());

serve.use('/api/billTotal', require('./api/bill/total')());


serve.use('/api/billList', require('./api/bill/list')());


serve.use('/api/billDetail', require('./api/bill/detail')());





serve.use(expressStatic('./dist'));