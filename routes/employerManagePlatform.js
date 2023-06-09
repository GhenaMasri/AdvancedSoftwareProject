const express = require("express");
const router = express.Router();
const { upload, con } = require("../config/myConn");
//
router.post("/post/:employeerID", (req, res) => {
  const employerID = req.params.employeerID;
  con.query(
    "SELECT type FROM users WHERE id=?",
    [employerID],
    (err, results) => {
      if (err) {
        console.log(err);
      } else {
        if (results[0].type == 0) {
          const id = req.body.id;
          const title = req.body.title;
          const description = req.body.description;
          const requirements = req.body.requirements;
          const salary = req.body.salary;
          const location = req.body.location;
          //  const employer_id =req.body.employer_id;//7
          con.query(
            "insert into jobs (id,title,description,requirements,salary,location,employer_id) VALUES(?,?,?,?,?,?,?)",
            [
              id,
              title,
              description,
              requirements,
              salary,
              location,
              employerID,
            ],
            (err, result) => {
              if (err) {
                console.log(err);
              } else {
                res.send("POSTED");
              }
            }
          );
        }
      }
    }
  );
});

router.put("/updateSalary/:employerID/:id", (req, res) => {
  const employerID = req.params.employerID;
  const jobID = req.params.id;
  const salary = req.body.salary;
  con.query(
    "SELECT type FROM users WHERE id=?",
    [employerID],
    (err, results) => {
      if (err) {
        console.log(err);
      } else {
        if (results[0].type == 0) {
          con.query(
            "UPDATE jobs SET salary = ? WHERE id = ? AND employer_id = ?",
            [salary, jobID, employerID],
            (err, result) => {
              if (err) {
                console.log(err);
                res.send("Error updating job");
              } else {
                res.send("Job updated  salary successfully");
              }
            }
          );
        }
      }
    }
  );
});

router.put("/updateDescription/:employerID/:id", (req, res) => {
  const employerID = req.params.employerID;
  const jobID = req.params.id;
  const description = req.body.description;
  con.query(
    "SELECT type FROM users WHERE id=?",
    [employerID],
    (err, results) => {
      if (err) {
        console.log(err);
      } else {
        if (results[0].type == 0) {
          con.query(
            "UPDATE jobs SET description = ? WHERE id = ? AND employer_id = ?",
            [description, jobID, employerID],
            (err, result) => {
              if (err) {
                console.log(err);
                res.send("Error updating job");
              } else {
                res.send("Job updated description successfully");
              }
            }
          );
        }
      }
    }
  );
});

router.put("/updateRequirements/:employerID/:id", (req, res) => {
  const employerID = req.params.employerID;
  const jobID = req.params.id;
  const requirements = req.body.requirements;
  con.query(
    "SELECT type FROM users WHERE id=?",
    [employerID],
    (err, results) => {
      if (err) {
        console.log(err);
      } else {
        if (results[0].type == 0) {
          con.query(
            "UPDATE jobs SET requirements = ? WHERE id = ? AND employer_id = ?",
            [requirements, jobID, employerID],
            (err, result) => {
              if (err) {
                console.log(err);
                res.send("Error updating job");
              } else {
                res.send("Job updated requirements successfully");
              }
            }
          );
        }
      }
    }
  );
});

router.put("/updateLocation/:employerID/:id", (req, res) => {
  const employerID = req.params.employerID;
  const jobID = req.params.id;
  const location = req.body.location;
  //const location=req.body.location;
  con.query(
    "SELECT type FROM users WHERE id=?",
    [employerID],
    (err, results) => {
      if (err) {
        console.log(err);
      } else {
        if (results[0].type == 0) {
          con.query(
            "UPDATE jobs SET location = ? WHERE id = ? AND employer_id = ?",
            [location, jobID, employerID],
            (err, result) => {
              if (err) {
                console.log(err);
                res.send("Error updating job");
              } else {
                res.send("table Job updated location successfully");
              }
            }
          );
        }
      }
    }
  );
});
router.delete("/delete/:employerID/:id", (req, res) => {
  const id = req.params.id;
  const employerID = req.params.employerID;
  con.query(
    "SELECT type FROM users WHERE id=?",
    [employerID],
    (err, results) => {
      if (err) {
        console.log(err);
      } else {
        if (results[0].type == 0) {
          con.query(
            "Delete FROM applications WHERE job_id=?",
            [id],
            (err1, results1) => {
              if (err1) {
                console.log(err1);
              } else {
                con.query(
                  "Delete FROM jobs WHERE id=?",
                  [id],
                  (err2, results2) => {
                    if (err2) {
                      console.log(err2);
                    } else {
                      res.send(
                        "table Job deleted from applications&jobs successfully"
                      );
                    }
                  }
                );
              }
            }
          );
        }
      }
    }
  );
});

module.exports = router;
