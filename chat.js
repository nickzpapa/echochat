
// setting up express with sessions
var express = require('express')
	, app = express();

var CookieParser = require('cookie-parser')
	, cookieParser = CookieParser()
	, expresssession = require('express-session');

app.use(cookieParser);
app.use(expresssession({
	secret: '245fdsfg2rf43f43',
	resave: false,
	saveUninitialized: true,
}));

// setting up server with express
var http = require('http')
	, server = http.createServer(app);

// setting up sockets
var io = require('socket.io').listen(server);


//chat data
var msgcount = 0;
var users = {};
var names = [""];

function getId(s) {
	return String(s.handshake["headers"].cookie).split(';')[1].substring(17).split('.')[0];
}


app.get('/', function (request, response) {
	var id = request.sessionID;
	console.log("- -- -- -- - -- -- -- -- - -- -- - -- -- -- -- - -- -- - -- - ");
	console.log("getting index:" + request.sessionID);	

	var user = {
		username	: "" ,
		font 		: "" ,
		backgr 		: ""
	}

	if(users[id] != null) {
		response.write('There was an error D: Please refresh page.');
	}
	else {
		users[id] = user;
		console.log(users[id]);
		response.sendFile(__dirname + '/index.html');
	}
});


app.get('/chat', function (request, response) {

	var id = request.sessionID;
	var user = users[id];
	console.log("- -- -- -- - -- -- -- -- - -- -- - -- -- -- -- - -- -- - -- - ");
	if (user == null || user.username==null || user.font==null || user.backgr==null){
		console.log(id + " could not get chat due to value nullity.");
		response.sendFile(__dirname + '/index.html');
		return true;
	}
	else{
		console.log(user.username + "(" + id + ") is getting chat.");
		response.sendFile(__dirname + '/chat.html');
	}
});



var userspace = io.of('/newuser');
userspace.on('connection', function (socket) {
	var id = getId(socket);
	console.log("- -- -- -- - -- -- -- -- - -- -- - -- -- -- -- - -- -- - -- - ");
	console.log(id + " has connected to newuser.");

	socket.on('new user', function (msg) {
	console.log("- -- -- -- - -- -- -- -- - -- -- - -- -- -- -- - -- -- - -- - ");
		
		var user = JSON.parse(msg);
		users[id] = user;
		console.log(id + " has requested a new user: " + user.username);

	});
	userspace.on('disconnect', function (msg) {
		console.log( id + " has disconnected from newuser");
	});
});


var chat = io.of('/chat');
chat.on('connection', function (socket){
	var id = getId(socket);
	var user = users[id];

	if (user == null || user.username==null || user.font==null || user.backgr==null){
		chat.emit('whoops', 'You have no username.');
		return false;
	}

	//on connection
	chat.emit('chat message', '<p style="width:100%;margin-top:0;margin-bottom:0; padding: 3px; background-color:' + user.backgr + '; color:' + user.font + ';">' + user.username + ' has connected</p>');
	console.log(user.username + '(' + id +' ) has connected to chat');
	chat.emit('message sent');

	//on message
  	socket.on('chat message', function (msg){
	  	chat.emit('chat message', '<p style="width:100%;margin-top:0;margin-bottom:0; padding: 3px; background-color:' + user.backgr + '; color:' + user.font + ';">' + user.username + ' : '  + msg +  '</p>');
	    console.log( "Message " + (++msgcount) +   ": " +   user.username +   ' says ' +   "\"" + msg  + "\"");
	    chat.emit('message sent');	    
  	});	

	//on disconnect
	socket.on('disconnect', function(){
		console.log(user.username + ' has disconnected');
		chat.emit('chat message', '<p style="width:100%;margin-top:0;margin-bottom:0; padding: 3px; background-color:' + user.backgr + '; color:' + user.font + ';">' + user.username + ' has disconnected</p>');
		users[id] = null;
	});
});

server.listen(3000, function(){
	console.log("- -- -- -- - -- -- -- -- - -- -- - -- -- -- -- - -- -- - -- - ");
	console.log('echo:> 3000');
});

