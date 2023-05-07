const express = require("express");
const port = 3000;

const { app, mysql, upload } = require("./config/myConn");
app.use(express.urlencoded({extended: true})); // New
// Parse application/json
app.use(express.json()); // New

//Routes Initialization
const appsRoutes = require("./routes/Applications");

//Using Routes
app.use("/apps", appsRoutes);


app.listen(port, () => {
  console.log(`Example app listening on port ${port}!`);
});