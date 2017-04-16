/**
 * Created by eli9 on 4/16/2017.
 */
var http = require('http');
var url = require('url');

function start(route) {
    function onRequest(request, response) {
        var pathname = url.parse(request.url).pathname;
        console.log("request for "+pathname+" received.");
        route(pathname);
        response.writeHead(200,{"Content-Type":"text/plain"});
        response.write("hello world");
        response.end();
    }
    http.createServer(onRequest).listen(9999);
    console.log("Server has started");
}

function route(pathname) {
    console.log("About to route a request for " + pathname);
}

start(route);
