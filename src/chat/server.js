/**
 * Created by eli9 on 4/16/2017.
 */
var express = require('express'); //引入express模块
var socket = require('socket.io');//import socket.io
var app = express();
var server = require('http').createServer(app);
app.use('/', express.static(__dirname+'/www'));
server.listen(91);
var io = socket.listen(server);

var users = new Array();
// users[0]="liyan";
// users[1]="system";
// users[2]="admin";
// users[3]="user";

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
            io.sockets.emit('system', nickname, users.length, 'login');//向所有连接到服务器的客户端发送当前登陆用户的昵称
        }
    })

    //断开连接的事件
    socket.on('disconnect', function() {
        //将断开连接的用户从users中删除
        users.splice(socket.userIndex, 1);
        //通知除自己以外的所有人
        socket.broadcast.emit('system', socket.nickname, users.length, 'logout');
    });

    socket.on('postMsg', function (msg, color) {
        //将消息发送到出自己以外的所有用户
        socket.broadcast.emit('newMsg',socket.nickname, msg, color);
    });

    socket.on('img', function (imgData) {
        socket.broadcast.emit('newImg',socket.nickname, imgData);
    });

});

//on 接受事件 emit发送事件
console.log("localhost:90")
console.log("End~");
