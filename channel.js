var app = require('express')();
var server = require('http').createServer(app);
var io = require('socket.io')(server);
var url = require('url');
var redis = require('redis');

var tokens = ['123', '234'];

server.listen(8000);
var client = redis.createClient(6379,'127.0.0.1',{});
var publisher = redis.createClient(6379,'127.0.0.1',{});

app.get('/', function (req, res) {
    var params = url.parse(req.url, true).query;//解释url参数部分name=zzl&email=zzl@sina.com
    var token = params.token;
    var content = params.content;
    var type = params.type;

    res.writeHead(200, {'Content-Type': 'application/json;charset=utf-8'});

    console.log('receive a danmu push.');

    if (typeof(token)!="undefined") {
        console.log(token);
        console.log(content);
        publisher.publish(token, "{\"content\":\""+ content +"\"}");
    }

    res.write("success");
    res.end();
});

io.sockets.use(function (socket, next) {
    var query = socket.handshake.query;
    if (typeof(query) == "undefined") {
        return next(new Error("not authorized"));
    }

    var token = query.token;

    checkAuthToken(token, function (err, authorized) {
        if (err || !authorized) {
            return next(new Error("not authorized"));
        }

        client.set(socket.id, token);
        return next();
    });
});

io.sockets.on('connection', function (socket) {

    console.log('receive a socket connect socket:' + socket.id);
    var subscriber = redis.createClient(6379,'127.0.0.1',{});

    var token;
    client.get(socket.id, function(err, res) {
        if (!err) {
            subscriber.subscribe(res);
            token = res;

            console.log('subscribe token:' + token);
        }
    });

    subscriber.on("message", function(channel, message) {
        console.log(channel);
        console.log(message);
        socket.emit("message", message);
    });

    socket.on('message', function (data) {//捕获客户端发送名为'my other event'的数据
        publisher.publish(token, data);
    });

    socket.on('disconnect', function () {

        console.log('disconnect socket:' + socket.id);
        subscriber.unsubscribe(token);
        subscriber.quit();
        client.del(socket.id);
    });
});

var checkAuthToken = function (token, callback) {
    if (typeof(token) == "undefined") {
        return callback('error', false);
    }

    if (tokens.indexOf(token) > -1) {   //token 校验
        return callback(null, true);
    }

    callback('error', false);
};