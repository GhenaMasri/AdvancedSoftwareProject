const express = require("express");
const router = express.Router();
const { upload, con} = require("../config/myConn");

router.get(
    "/JobSearch/loc/:location", (req,res)=>{
        const joblocation = req.params.location;
        con.query('select * from jobs where location=?',joblocation,(err,result)=>{
            if(err){
                console.log(err)
            } else {
                res.send(result)// for json : console.log(result) , the result will be on the console not postman
            }
        })
    }
)

router.get(
    "/JobSearch/tit/:title", (req,res)=>{
        const jobtitle = req.params.title;
        con.query('select * from jobs where title=?',jobtitle,(err,result)=>{
            if(err){
                console.log(err)
            } else {
                res.send(result)// for json : console.log(result) , the result will be on the console not postman
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
                res.send(result)// for json : console.log(result) , the result will be on the console not postman
            }
        })
    }
)

module.exports = router;