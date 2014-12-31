var app = require('express')();
var http = require('http').Server(app);
var io = require('socket.io')(http);
var userDef;
var id = null;
var num_mess = 0;
var user = null;

app.get('/', function (request, response) {
	response.sendFile(__dirname + '/index.html');
});

app.get('/chat', function (request, response) {
	if (user == null || user.username==null || user.font==null || user.backgr==null){
		response.sendFile(__dirname + '/index.html');
	}
	else{
		console.log('user getting chat.html');
		response.sendFile(__dirname + '/chat.html');
	}
});

var chat = io.of('/chat');
var userspace = io.of('/newuser');
userspace.on('connection', function (socket) {
	console.log("user has connected to newuser");
	socket.on('new user', function (msg) {
		user = JSON.parse(msg);
	});
	userspace.on('disconnect', function (msg) {
		console.log("user has disconnected from newuser");
	});
});


chat.on('connection', function (socket){
	id = 0;
	if (user == null || user.username==null || user.font==null || user.backgr==null){
		chat.emit('chat message', 'you have no username');
		return false;
	}

	//on connection
	chat.emit('chat message', '<p style="width:100%;margin-top:0;margin-bottom:0; padding: 3px; background-color:' + user.backgr + '; color:' + user.font + ';">' + user.username + ' has connected</p>');
	console.log(user.username + ' says has connected');
	chat.emit('message sent');

  	socket.on('chat message', function (msg){
	  	chat.emit('chat message', '<p style="width:100%;margin-top:0;margin-bottom:0; padding: 3px; background-color:' + user.backgr + '; color:' + user.font + ';">' + user.username + ' : '  + msg +  '</p>');
	    console.log("Message " + ++num_mess + ": " + user.username + ' says ' + "\"" + msg  + "\"");
	    chat.emit('message sent');	    
  	});	

	socket.on('disconnect', function(){
		console.log(id + ' has disconnected');
		chat.emit('chat message', '<p style="width:100%;margin-top:0;margin-bottom:0; padding: 3px; background-color:' + user.backgr + '; color:' + user.font + ';">' + user.username + ' has disconnected</p>');
	});
});

http.listen(3000, function(){
	console.log('listening on *:3000');
});

