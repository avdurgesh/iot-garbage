const http = require('http');
const express = require('express');
const SocketIO = require('socket.io');
var connection = require('./config');
var moment = require("moment");

const app = express();
const server = http.createServer(app);
const io = SocketIO.listen(server);
var id = 0 ;
var temp ;
var distance;
var load;
var load_value;

const SerialPort = require('serialport');
const ReadLine = SerialPort.parsers.Readline;

const port = new SerialPort("COM8", {
  baudRate: 9600
});
const parser = port.pipe(new ReadLine({ delimiter: '\r\n' }));

parser.on('open', function () {
  console.log('connection is opened');
});

parser.on('data', function (data) {
  console.log(data);
  id = data.slice(0, 2);
  if(id=="10"){
    console.log("id:",id);
    temp = data.slice(2, 10);
    if(temp=="distance"){
      distance = data.slice(10,13);
      console.log("distance : ",distance);
      load = data.slice(13, 17);
      if(load=="load"){
        load_value = data.slice(17,20);
        console.log("Load : ",load_value);
      }
    }
    else{
      console.log('error...');
     // console.log(data); 
    }
    };
  io.emit('temp', data.toString());
  var date = moment().format("YYYY-MM-DD");
  var time = moment().format("hh:mm:ss");
  connection.query('INSERT INTO DUSTBINS VALUES("'+id+'","'+distance+'","'+load_value+'","'+date+'","'+time+'")', (err, results, fields)=>{
    if(err) console.log(err);
    else{
      console.log('success');
    }  
   // res.send(results);
  })
 
});







