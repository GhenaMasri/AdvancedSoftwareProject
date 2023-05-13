const express = require("express");
const router = express.Router();
const { upload, con} = require("../config/myConn");


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

module.exports = router;
