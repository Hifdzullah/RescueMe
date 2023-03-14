const mysql = require("mysql2");
const express = require("express");

//middle ware
const bodyParser = require("body-parser");
const encoder = bodyParser.urlencoded;
const app = express();

const dbconnection = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "root000",
    database: "db_auth"
});


dbconnection.connect(function(error){
  if (error) throw error
  else console.log("connected to the database successfully!")
});

app.get("/",function(req,res){
  res.sendFile(__dirname + "/index.html");
})

app.post("/",encoder, function(req,res){
  var username = req.body.username;
  var password = req.body.password;

  dbconnection.query("select * from tbl_auth_reg where username = ? and password = ?",[username,password],function(error,results,fields){
      if (results.length > 0) {
          //Redirect to new page if found
          res.redirect("/Homepage");
          //else pass
      } else {
          res.redirect("/");
      }
      res.end();
  })
})

// when login is success
app.get("/Homepage",function(req,res){
  res.sendFile(__dirname + "/index.html")
})


// set app port 
app.listen(4000);
