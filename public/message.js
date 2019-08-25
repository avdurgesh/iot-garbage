var express = require("express");
var app = express();
var bodyParser = require('body-parser');
var connection = require('../config');

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());


	//return res.redirect('home');

app.get("/", function(req, res)
{
    res.sendFile("home.html", {"root": __dirname});
});
app.post('/message',function(req,res){
  var name=req.body.name;
  var email=req.body.email;
  var phone=req.body.phone;
  var id=req.body.dustbin_id;
  var area=req.body.area;
  var message=req.body.message;

  connection.query('INSERT INTO MESSAGE VALUES("'+name+'","'+email+'","'+phone+'","'+id+'","'+area+'","'+message+'")', function(err){
    if(err){
      console.log("Message is not inserted");
    }
    console.log("Message has submitted successfully..");
  })
  return res.redirect("/");
});
app.listen(3000);