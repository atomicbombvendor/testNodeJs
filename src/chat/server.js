/**
 * Created by eli9 on 4/16/2017.
 */
var express = require('express'); //引入express模块
var app = express();
var server = require('http').createServer(app);
app.use('/', express.static(__dirname+'/www'));
server.listen(80);
