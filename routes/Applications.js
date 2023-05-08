const express = require("express");
const router = express.Router();
const { upload, con} = require("../config/myConn");
const fs = require("fs");
const path = require("path");

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




module.exports = router;
