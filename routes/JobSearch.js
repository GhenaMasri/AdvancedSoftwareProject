const express = require("express");
const router = express.Router();
const { upload, con} = require("../config/myConn");
const fs = require('fs');

var filename=null;
var path="../pdfs";
var title1=null;
var counter=1;

router.get(
    "/JobSearch/loc/:location", (req,res)=>{
        const joblocation = req.params.location;
       // joblocation = joblocation.toLowerCase();
        con.query('select * from jobs where location=?',joblocation,(err,result)=>{
            if(err){
                console.log(err)
            } else {
                //filename=saveResultsToFile(result);
                title1=joblocation;
                filename=result;
                res.send(result)// for json : console.log(result) , the result will be on the console not postman
            }
        })
    }
)

router.get(
    "/JobSearch/tit/:title", (req,res)=>{
        const jobtitle = req.params.title;
       // jobtitle=jobtitle.toLowerCase();
        con.query('select * from jobs where title=?',jobtitle,(err,result)=>{
            if(err){
                console.log(err)
            } else {
              // filename= saveResultsToFile(result);
              title1=jobtitle;
              filename=result;
                res.send(result)//  for json : console.log(result) , the result will be on the console not postman
            }
        })
    }
)



router.get(
    "/JobSearch/sal/:salary", (req,res)=>{
        const jobsalary = req.params.salary;
        con.query('select * from jobs where salary=?',jobsalary,(err,result)=>{
            if(err){
                console.log(err)
            } else {
                //filename=saveResultsToFile(result);
                title1=jobsalary;
                filename=result;
                res.send(result)// for json : console.log(result) , the result will be on the console not postman
            }
        })
    }
)



/*function saveResultsToFile(results) {
    const timestamp = new Date().toISOString();
    const jsonData = JSON.stringify(results);
    filename = `../pdfs/search_results_${timestamp}.txt`;
    
    fs.writeFile(filename, jsonData, (err) => {
      if (err) {
        console.error('Error saving search results:', err);
      } else {
        console.log('Search results saved to file:', filename);
      }
    });
  
    return filename;
  }*/
  
  
  function insertFileIntoDatabase(idd, filename) {
    
    const sql = 'INSERT INTO save (row_id, title, id , results) VALUES (?, ?, ?, ?)';
    const jsonData = JSON.stringify(filename);
    con.query(sql, [counter, title1, idd, jsonData], (err, result) => {
      if (err) {
        console.error('Error inserting file into the database:', err);
      } else {
        console.log('File content inserted into the database');
        counter=counter+1;
      }
    });
  }
 
router.post(
    "/saved/:id" , (req,res)=>{
       
        const idd=req.params.id;
        if(filename!=null)
        {
            insertFileIntoDatabase(idd, filename);
            res.send('inserted successfully');
        }
        else{
            res.send('file is empty');
        }
    }
)
module.exports = router;