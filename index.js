var app = require('express')();
var http = require('http').Server(app);
var io = require('socket.io')(http);


app.get('/', function(request, response) {
	response.sendFile(__dirname + '/index.html');
});

var id;
var num_mess = 0;

io.on('connection', function(socket){


	//#212346

	//TODO: SET UP FUNCTION FILE FOR RGB AND SUCH
	var id = Math.floor((Math.random() * 10) + 1);
	var r = Math.floor((Math.random() * 255) + 1);
	var g = Math.floor((Math.random() * 255) + 1);
	var b = Math.floor((Math.random() * 255) + 1);

	//on connection
	io.emit('chat message', '<p style="width:100%;margin-top:0;margin-bottom:0; padding: 3px; background-color:#212346; color:rgb(' + r + ',' + g + ',' + b + ');">' + id + ' has connected</p>');
	console.log(id + ' says has connected');
	io.emit('message sent');

  	socket.on('chat message', function(msg){
	  	io.emit('chat message', '<p style="width:100%;margin-top:0;margin-bottom:0; padding: 3px; left:0px;background-color:#212346; color:rgb(' + r + ',' + g + ',' + b + ');"> ' + id + ' : '  + msg +  '</p>');
	    console.log("Message " + ++num_mess + ": " + id + ' says ' + "\"" + msg  + "\"");
	    io.emit('message sent');	    
  	});	

	socket.on('disconnect', function(){
		console.log(id + ' has disconnected');
		io.emit('chat message', '<p style="width:100%;margin-top:0;margin-bottom:0; padding: 3px; background-color:#212346; color:rgb(' + r + ',' + g + ',' + b + ');">' + id + ' has disconnected</p>');
	});
});

http.listen(3000, function(){
	console.log('listening on *:3000');
});

