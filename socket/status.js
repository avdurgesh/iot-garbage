var express = require('express');
var app = express();
var connection = require("./config");
var http = require('http').Server(app);


app.use('/public', express.static(__dirname + '/public'));

app.get('*', function(req, res){
	res.sendfile(__dirname + '/public/status.html');
  });

var server = http.listen(3001, "127.0.0.1", () => { //Start the server, listening on port 3001.
    console.log("Listening to requests on port 3001...");
})

var io = require('socket.io')(server); //Bind socket.io to our express server.
//app.use(express.static('public')); //Send status.html page on GET /

var id ;
var dustbin_level;
var dustbin_load;


connection.query('select * from dustbins where dustbin_level=9', (err, results, fields)=>{
    if(err) console.log(err);
    else{
      console.log('successfully fetched data..');
    }  
   // res.send(results);
   id = results[0].id;
   dustbin_level = results[0].dustbin_level;
   dustbin_load = results[0].dustbin_load;
   	console.log(id);
  	console.log(dustbin_level);
	console.log(dustbin_load);
	
	io.on('connection', (socket) => {
		console.log("Someone connected."); //show a log as a new client connects.
		io.sockets.emit('id', {id:id,dustbin_level:dustbin_level,dustbin_load:dustbin_load}); //emit the data
	})
});
  
  

 

