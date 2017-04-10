/**
 * Created by ZZ on 2017/4/10.
 */
var fs = require("fs");
var data = fs.readFileSync('resources\\input.txt');
console.log(data.toString());
console.log("End!");
//非阻塞式
fs.readFile('resources\\input.txt', function(err, data){
  if(err) return console.error(err);
  console.log(data.toString());
}//回调函数
);
console.log("End!")

var events = require('events');
var eventEmitter = new events.EventEmitter();
//使用EventEmitter,用一个名字绑定一个function,并使用名字直接执行这个function。
var connectHandler = function connected(){
    console.log("Connect succeed!");

    eventEmitter.emit('data_recv');
}

eventEmitter.on('connect',connectHandler);

eventEmitter.on('data_recv',function(){
    console.log("data received suceessful!");
});

eventEmitter.emit('connect');
console.log("程序执行完毕！");