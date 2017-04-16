/**
 * Created by ZZ on 2017/4/10.
 */
var http = require('http');

http.createServer(function (request, response) {

    //发送Http头部
    //Http状态值：200 OK
    //内容类型：text/plain
    response.writeHead(200,{'Content-Type':'text/plain'});

    //发送响应数据 "Hello world"
    response.end('Hello world123\n');
}).listen(8888);

//终端打印如下信息
console.log("Server running at http://127.0.0.1:8888/");
