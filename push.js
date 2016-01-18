var http = require('http');
var url = require("url");
http.createServer(function (req, res) {
    var params = url.parse(req.url, true).query;//解释url参数部分name=zzl&email=zzl@sina.com
    var name = params.name;

    if (name != null) {
        console.log(name);
    }

    res.writeHead(200, {
        'Content-Type': 'text/plain;charset=utf-8'
    });

    res.write("success");
    res.end();
}).listen(8000, "127.0.0.1");
console.log('Server running at http://127.0.0.1:8000/');