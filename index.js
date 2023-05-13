const express = require("express");
const port = 3000;

const { app, mysql, upload } = require("./config/myConn");
app.use(express.urlencoded({extended: true})); // New
// Parse application/json
app.use(express.json()); // New

//Routes Initialization
const appsRoutes = require("./routes/Applications");
const jobsRoutes = require("./routes/JobSearch");
const loginRoutes = require("./routes/login");

//Using Routes
app.use("/apps", appsRoutes);
app.use("/jobs", jobsRoutes);
app.use("/logs", loginRoutes);


app.listen(port, () => {
  console.log(`Example app listening on port ${port}!`);
});