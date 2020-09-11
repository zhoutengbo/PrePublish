

const port = 3030;


var express = require('express');
var app = express();
var routes = require('./routes')(app);
app.listen(port);

