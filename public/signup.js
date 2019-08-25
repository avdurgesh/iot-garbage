var express=require("express");
var bodyParser=require('body-parser');
 
var connection = require('./config.js');
var app = express();
 
var authenticateController=require('./authenticate_controller');
var registerController=require('./register_controller');
var urlencodedParser = bodyParser.urlencoded({ extended: true });

app.use(urlencodedParser);
app.use(bodyParser.json());
app.use(urlencodedParser);
/*
app.get('/', function (req, res) {  
   res.sendFile( __dirname + "/" + "home.html" );  
})  
 
app.get('/login.html', function (req, res) {  
   res.sendFile( __dirname + "/" + "login.html" );  
}) 
app.get('/signup.html', function (req, res) {  
   res.sendFile( __dirname + "/" + "signup.html" );  
}) 
*/
app.post('/api/signup',registerController.register);
app.post('/api/authenticate',authenticateController.authenticate);
 
console.log(authenticateController);
app.post('/register-controller', registerController.register);
app.post('/authenticate-controller', authenticateController.authenticate);
app.listen(1235);
