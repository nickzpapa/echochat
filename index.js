var app = require('express')();
var http = require('http').Server(app);
var io = require('socket.io')(http);


app.get('/', function(request, response) {
	response.sendFile(__dirname + '/index.html');
});

var id;

io.on('connection', function(socket){

	//TODO: SET UP FUNCTION FILE FOR RGB AND SUCH
	var id = Math.floor((Math.random() * 10) + 1);
	var r = Math.floor((Math.random() * 255) + 1);
	var g = Math.floor((Math.random() * 255) + 1);
	var b = Math.floor((Math.random() * 255) + 1);

	io.emit('chat message', '<p style="color:rgb(' + r + ',' + g + ',' + b + ');">' + id + ' has connected</p>');

  	socket.on('chat message', function(msg){
	  	io.emit('chat message', '<p style="color:rgb(' + r + ',' + g + ',' + b + ');">' + id + ' : '  + msg +  '</p>');
	    console.log(id + ' says ' + msg);
  	});	

	socket.on('disconnect', function(){
		console.log(id + ' has disconnected');
		io.emit('chat message', '<p style="color:rgb(' + r + ',' + g + ',' + b + ');">' + id + ' has disconnected</p>');
	});
});

http.listen(3000, function(){
	console.log('listening on *:3000');
});
