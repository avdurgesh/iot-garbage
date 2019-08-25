const http = require('http');
const mysql = require('mysql');

const pool = mysql.createPool({  
  host: 'localhost',
  user: 'root',
  password: 'admin',
  database: 'garbage_management',
  charset: 'utf8'
});

//html string that will be send to browser
var reo ='<html><head><title>my data</title></head><body><h1>result table</h1>{${table}}</body></html>';

//sets and returns html table with results from sql select
let sql ='SELECT Distance_level, Load_level FROM dustbin';
function setResHtml(sql, cb){
  pool.getConnection((err, con)=>{
    if(err) throw err;

    con.query(sql, (err, res, cols)=>{
      if(err) throw err;

      var table =''; //to store html table

      //create html table with data from res.
      for(var i=0; i<res.length; i++){
        table +='<tr><td>'+ (i+1) +'</td><td>'+ res[i].Distance_level +'</td><td>'+ res[i].Load_level +'</td></tr>';
      }
      table ='<table border="1"><tr><th>Distance_level</th><th></th><th>Load_level</th></tr>'+ table +'</table>';

      con.release(); //Done with mysql connection

      return cb(table);
    });
  });
}
let sql ='SELECT Distance_level, Load_level FROM dustbin';

//create the server for browser access
const server = http.createServer((req, res)=>{
  setResHtml(sql, resql=>{
    reo = reo.replace('{${table}}', resql);
    res.writeHead(200, {'Content-Type':'text/html; charset=utf-8'});
    res.write(reo, 'utf-8');
    res.end();
  });
});

server.listen(8080, ()=>{
  console.log('Server running at //localhost:8080/');
});