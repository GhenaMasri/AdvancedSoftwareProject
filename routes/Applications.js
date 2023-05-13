const express = require("express");
const router = express.Router();
const { upload, con} = require("../config/myConn");
const fs = require("fs");
const path = require("path");
const { sendEmails } = require('./gmail');
var emails=null;
//Testing Pull Request

const resumeDirectory = "../savedPDFs"; // Specify the directory path where the resumes will be saved
// Create the directory if it doesn't exist
if (!fs.existsSync(resumeDirectory)) {
  fs.mkdirSync(resumeDirectory);
}

router.post(
  "/ApplicationSubmission/:userId/:jobID",
  upload.fields([{ name: "resume" }, { name: "coverletter" }]),
  (req, res) => {
    const userId = req.params.userId;
    const jobID = req.params.jobID;
    const appID = req.body.id;
    const pdf1 = req.files["resume"][0].buffer;
    const pdf2 = req.files["coverletter"][0].buffer;
    const query =
      "INSERT INTO applications (id, resume, cover_letter, job_id, employee_id) VALUES (?, ?, ?, ?, ?)";
    con.query(query, [appID, pdf1, pdf2, jobID, userId], (err, results) => {
      if (err) console.log(err);
      else res.send("row inserted into database applications table");
    });
  }
);


router.get("/getApplications/:employeerID/:jobID", (req, res) => {
  const employeerID = req.params.employeerID;
  const jobID = req.params.jobID;
  con.query("SELECT type FROM users WHERE id=?", employeerID, (err, results) => {
    if (err) {
      console.log(err);
    } else {
      if (results[0].type == 0) {
        con.query(
          "SELECT * FROM applications a, users u, jobs j WHERE a.job_id = j.id AND a.job_id = ? AND j.employer_id = ? AND a.employee_id = u.id",
          [jobID, employeerID],
          (err, innerResults) => {
            if (err) {
              console.log(err);
            } else {
              const resumePaths = [];
              const coverletterPaths=[];
              const otherData = [];

              innerResults.forEach((row) => {
                const resumeBuffer = Buffer.from(row.resume, "base64");
                const coverletterBuffer = Buffer.from(row.cover_letter,"base64");
                const resumePath = path.join(__dirname, resumeDirectory, `resume_${row.name}.pdf`);
                const coverPath = path.join(__dirname, resumeDirectory, `coverLetter_${row.name}.pdf`);
                fs.writeFileSync(resumePath, resumeBuffer);
                fs.writeFileSync(coverPath, coverletterBuffer);
                resumePaths.push(resumePath);
                coverletterPaths.push(coverPath);
                otherData.push({
                  title: row.title,
                  employee_id: row.employee_id,
                  employee_name: row.name,
                  employee_email: row.email,
                  employee_phone: row.phone_number,
                  description: row.description,
                  requirements: row.requirements,
                  salary: row.salary,
                  location: row.location,
                  rate: row.rate
                });
              });

              const responseObj = {
                resumes: resumePaths,
                coverletters: coverletterPaths,
                otherData: otherData
              };

              res.setHeader("Content-Type", "application/json");
              res.send(responseObj);
            }
          }
        );
      }
    }
  });
});

//Manage Applications By Giving Rate
router.put("/setRate/:ApplicationID",(req,res)=>{
  //Only Accessed by the employeer after getting the applications
  const rate = req.body.rate;
  const AppID=req.params.ApplicationID;
  //const employee_id=req.params.employeeID;
  if(rate>=0 && rate<=5){
  con.query("UPDATE applications set rate=? WHERE id=?",[rate,AppID],(err,result)=>{
      if(err)
        console.log(err);
        else {
          res.send("Rate added successfully");
        }
      });
  }
  else{
    res.send("Please Enter A Rate Between 0 and 5");
  }
});

//Get Employee With Maximum Rate
router.get("/FilterEmployeeWithMaxRate/:jobID", (req, res) => {
  const jobID = req.params.jobID;
  con.query( "SELECT a.employee_id, a.rate FROM applications a INNER JOIN (SELECT MAX(rate) AS max_rate FROM applications) m ON a.rate = m.max_rate", (err, results) => {
    if (err) {
      console.log(err);
    } else {
      const employeeIds = [];
      
      for (let i = 0; i < results.length; i++) {
        const row = results[i];
        const employeeId = row.employee_id;
        employeeIds.push(employeeId);
      }
      con.query("SELECT * FROM users WHERE id IN (?)", [employeeIds], (err, users) => {
        if (err) {
          console.log(err);
        } else {
          emails = users.map((row) => row.email);
       //
         res.send(users);
        //
    }});
    }
  });
});

//Sending Emails for Employees with maximum rate to start interviewing
router.post("/SendEmails",(req,res)=>{
  if(emails != null){
  sendEmails(emails)
            .then(() => {
              console.log('Emails sent successfully');
              res.status(200).json({ message: 'Emails sent successfully.'});
            })
            .catch((error) => {
              console.error('Error sending emails:', error);
              res.status(500).json({ error: 'An error occurred while sending emails.' });
            });
        

}
else res.send("emails list is empty")
});

module.exports = router;