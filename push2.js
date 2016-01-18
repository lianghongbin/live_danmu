/**
 * Created by lianghongbin on 16/1/14.
 */
var redis = require("redis");
var http = require('http');
var url = require("url");
var info = "通过HTTPGet方式成功加入队列";
http.createServer(function (req, res) {
    var params = url.parse(req.url, true).query;//解释url参数部分name=zzl&email=zzl@sina.com
    var client = redis.createClient();

    console.log(params.name);

    client.set("name", params.name, function (err, reply) {
        console.log(reply.toString());
        console.log('test');
    });


    res.writeHead(200, {
        'Content-Type': 'text/plain;charset=utf-8'
    });
    client.get("name", function (i, o) {
        console.log(o);//回调，所以info可能没法得到o的值，就被res.write输出了
    })
    client.quit();
    res.write(info);
    res.end();
}).listen(8000, "127.0.0.1");
console.log('Server running at http://127.0.0.1:8000/');