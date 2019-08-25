
var express = require('express');
var app = express();
require('./read_serial.js');
var bodyParser = require('body-parser');
var server = require('http').createServer(app);  
var io = require('socket.io')(server);
var connection = require("./config.js")
var session = require('express-session');
//var app = express();

app.use(bodyParser());
app.use(bodyParser.urlencoded({extended:true}));

app.use(express.static(__dirname + '/public'));
require('./public/message.js');

app.get('/',function(req,res){
    res.send(
   '<!DOCTYPE html><html lang="en"><head><title>Home</title><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1"><link rel="stylesheet" type="text/css" href="public/home.css"><ul class="active"><img src="images/header.jpg" alt="header" style="height: 2%;width:100%;"><li><a  href="public/home.html">Home</a></li><li><a href="public/aboutproject.html">About us</a></li><li><a href="public/aboutus.html">Meet our Team</a></li><li><a href="public/contactus.html">Contact Us</a></li><li style="float:right"><a href="login.html">Login</a></li></ul></head><body><div class="column middle"><h2 style="text-align: center;font-family: Fira Sans">Welcome to Smart Garbage Managment System</h2><div style="float: center;text-align : center"><h3>This Project is develop by </h3><table align="center" style= "border: 1px solid black;width:30%"><tr><td style="border: 1px solid black">Archana Maurya</td></tr><tr><td style="border: 1px solid black">Arun Rajput</td></tr><tr><td style="border: 1px solid black">Durgesh Verma</td></tr><tr><td style="border: 1px solid black">Jitendra Singh Tomar</td></tr><tr><td style="border: 1px solid black">Mayank Bhatia</td></tr></table></div><div><p style="text-align: center"> This is done under the mentorship of Krishna Sir</p><p>For Visiting website please <a href="public/home.html">click here</a></p><p style="text-align: center"> Centre for Development of Advanced Computing (C-DAC)</p><p style="text-align: center"> Bangalore,India </p></div></body><footer style="background-color: gray;"><!--  <h1 style="text-align: center;">About Us</h1>--><p style="text-align: center">This website is designed by: CDAC-IoT Team<br>All rights are reserved</p></footer></html>'
 )
});

var id ;
var dustbin_level;
var dustbin_load;

app.use(session({
    secret:'ndabdadjadknakdbgugd@$##@344',
    resave: false,
    saveUninitialized: true
    }));

app.post('/sign_in',function(req,res){
    session = req.session;
    if(session.uniqueID){
        return res.redirect('/redirect');
    }
        session.uniqueID = req.body.email;
    res.redirect('/redirect');
});
app.get('./home',function(req,res){
    res.redirect('/home.html');
})

app.get('/logout',function(req,res){
    req.session.destroy();
    res.redirect('/');
});

app.post('/logout',function(req,res){
    req.session.destroy();
    res.redirect('/');
});

app.get('/redirect',function(req,res){
    session = req.session;
    if(session.uniqueID){
        console.log(session);
        res.redirect('/admin');
    }
    else{
        res.send(req.session.uniqueID + 'not found <a href="/logout">Kill Session</a>');
    }
});

app.get('/admin',function(req,res) {
    session = req.session;
    if(session.uniqueID != 'jitendratomar49@gmail.com') {
       return res.send('Better Luck Next time');
    }
    app.use(express.static(__dirname + '/public'));
    return res.redirect('status.html')
})

connection.query('SELECT id,dustbin_level,dustbin_load FROM dustbins ORDER BY date and time DESC LIMIT 1', (err, results, fields)=>{
    if(err) console.log(err);
    else{
      console.log('successfully fetched data..');
    }  
   // res.send(results);
   id = results[0].id;
   dustbin_level = results[0].dustbin_level;
   dustbin_load = results[0].dustbin_load;

    io.on('connection', function(socket) {
        console.log('A user connected');
        io.sockets.emit('data', {id:id,dustbin_level:dustbin_level,dustbin_load:dustbin_load});
        socket.on('disconnect', function () {
        console.log('A user disconnected');
        });
    })
});

server.listen(3001);