var io = require('socket.io-client');

//var socket = io.connect('http://101.200.128.82:8000',{query:"token=123"});
var socket = io.connect('http://localhost:8000',{query:"token=123"});


socket.on('connect', function () {
    console.log("socket connect success.");
});

socket.on('message', function (data) {
    console.log('receive a data:' + data);
});

socket.on('error', function(data){
    console.log("error:" + data);
});

socket.on('disconnect', function () {
    console.log("disconnected");
});