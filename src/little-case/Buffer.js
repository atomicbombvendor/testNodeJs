/**
 * Created by eli9 on 4/13/2017.
 */
var buf = new Buffer(10);
var val = new Buffer("www.runoob.com","utf-8");

len = buf.write("www.runoob.com");
console.log(len);
//print
console.log(buf.toString('utf-8',0,11));

//to json
var json = buf.toJSON();
console.log(json);

//concat buffer
var buf2 = new Buffer(" www.test.com");
var buf3 = Buffer.concat([buf,buf2]);
console.log(buf3.toString());

//compare buffer
var abc = new Buffer("ABC");
var abcd = new Buffer("ABCD");
var result = buff