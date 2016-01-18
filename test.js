/**
 * Created by lianghongbin on 16/1/15.
 */

var tokens = [
    {token : 't1', sockets: ['socket11','socket12']},
    {token : 't2', sockets: ['socket21','socket22']},
    {token : 't3', sockets: ['socket333']}
];


for (var i = 0; i < tokens.length; i++) {
    if (tokens[i].token == 't3') {
        console.log('found');
        var sockets = tokens[i].sockets;
        console.log(sockets);
        sockets.push("socket33");
        sockets.forEach(function (item, index) {
           console.log(item);
        });


    }
}