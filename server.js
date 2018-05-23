const express = require('express');
const expressStatic = require('express-static');
const bodyParser = require('body-parser');
const expressRoute = require('express-route');

let serve = express();

serve.listen(8080);

serve.use(bodyParser.json({}));

serve.use('/api/billTotal', require('./api/total')());


serve.use('/api/billList', require('./api/list')());


serve.use('/api/billDetail', require('./api/detail')());





serve.use(expressStatic('./dist'));