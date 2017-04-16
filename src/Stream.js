/**
 * Created by eli9 on 4/16/2017.
 */
var fs = require("fs"); // fs module

// var data = '';
//
// var readerStream = fs.createReadStream("..\\resources\\input.txt");
// readerStream.setEncoding('UTF-8');
// //处理流事件 data end error
// readerStream.on('data', function (chunk) {
//     data += chunk;
// });
//
// readerStream.on('end', function () {
//     console.log(data);
// });
//
// readerStream.on('error', function (err) {
//     console.log(err.stack);
// });
//
// console.log("程序执行完毕");


// var writerStream = fs.createWriteStream("..\\resources\\output.txt");
// readerStream.pipe(writerStream);
// console.log("程序执行完毕");

var zlib = require('zlib');
fs.createWriteStream("..\\resources\\output.txt").pipe(zlib.createGzip()).pipe(fs.createWriteStream('input.txt.gz'));
console.log("文件压缩完成");

fs.createReadStream("input.txt.gz").pipe(zlib.createGunzip()).pipe(fs.createWriteStream("input.txt"));
console.log("文件解压完成");