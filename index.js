var app = require('express')();
var http = require('http').Server(app);
var io = require('socket.io')(http);

io.on('connection', function (socket) {

	app.get('/home', function(request, response) {
		response.sendFile(__dirname + '/user.html');
	});

});