const express = require("express");
const app = express();
const mysql = require('mysql');
const port = 3000;

//for pdf
const multer = require('multer');
const upload = multer();

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

//Application Submittion
app.post("/ApplicationSubmission/:userId/:jobID",upload.fields([{name: 'resume'}, {name: 'coverletter'}]),(req,res)=>{
   const userId= req.params.userId; 
   const jobID = req.params.jobID;
   const  appID=req.body.id;
   const pdf1 = req.files['resume'][0].buffer; // First PDF 
   const pdf2 = req.files['coverletter'][0].buffer; // Second PDF 
   const query = 'INSERT INTO applications (id, resume, cover_letter, job_id, employee_id) VALUES (?, ?, ?, ?, ?)';
   con.query(query,[appID,pdf1,pdf2,jobID,userId], (err, results) => {
    if (err) console.log(err);
    else res.send('row inserted into database applications table');
  });



});

app.listen(port, () => {
  console.log(`Example app listening on port ${port}!`);
});