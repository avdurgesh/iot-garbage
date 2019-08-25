var express = require("express");
var app     = express();
var path    = require("path");
var mysql = require('mysql');
var bodyParser = require('body-parser');
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
var con = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "admin",
  database: "garbage_management"
});
app.get("/", function(req, res)
{
    res.sendFile("home.html", {"root": __dirname});
});
app.post('/submit',function(req,res){
  var id=req.body.dustbin_id;
  var location=req.body.dustbin_location;
  var area=req.body.dustbin_area;

  con.query('INSERT INTO MESSAGE VALUES("'+id+'","'+location+'","'+area+'")', function(err){
    if(err){
      console.log("dustbin not added ");
    }
    console.log("dustbin added successfully successfully..");
  })
  return res.redirect("home.html");
});
app.listen(3000);
console.log("Running at Port 3000");