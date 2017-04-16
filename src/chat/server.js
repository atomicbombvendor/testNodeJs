/**
 * Created by eli9 on 4/16/2017.
 */
var express = require('express'); //引入express模块
var socket = require('socket.io');//import socket.io
var app = express();
var server = require('http').createServer(app);
app.use('/', express.static(__dirname+'/www'));
server.listen(90);
var io = socket.listen(server);

var users = new Array(100);
users[0]="liyan";
users[1]="system";
users[2]="admin";
users[3]="user";

//socket part
io.on('connection',function(socket){
    //receive and process foo from client
    socket.on('foo',  function (data) {
        console.log("data"+data);
    })
    //昵称设置
    socket.on('login', function (nickname) {
        if(users.indexOf(nickname) > -1){
            socket.emit('nickExisted');
        }else{
            socket.userIndex = users.length;
            socket.nickname = nickname;
            users.push(nickname);
            socket.emit('loginSuccess');
            io.sockets.emit('system', nickname);//向所有连接到服务器的客户端发送当前登陆用户的昵称
        }
    })
});

console.log("End~");
