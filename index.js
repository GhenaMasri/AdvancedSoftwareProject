const express = require("express");
const app = express();
const mysql = require('mysql');
const port = 3000;

app.use(express.urlencoded({extended: true})); // New
// Parse application/json
app.use(express.json()); // New

const con  = mysql.createConnection({
  connectionLimit : 10,
  host            : 'localhost',
  user            : 'root',
  password        : '',
  database        : 'advancedsoftwareproject'
});

con.connect((err)=>{
if(err){
  console.log(err);}
  else console.log("Connected");
});

app.get("/", (req, res) => {
  res.send("Hello World!");
});

app.listen(port, () => {
  console.log(`Example app listening on port ${port}!`);
});