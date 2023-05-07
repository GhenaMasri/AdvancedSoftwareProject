const express = require("express");
const app = express();
const mysql = require("mysql");
const multer = require("multer");
const upload = multer();

const con = mysql.createConnection({
  connectionLimit: 10,
  host: "localhost",
  user: "root",
  password: "",
  database: "advancedsoftwareproject",
});

con.connect((err) => {
  if (err) {
    console.log(err);
  } else console.log("Connected");
});

module.exports = {
  app,
  mysql,
  upload,
  con,
};
