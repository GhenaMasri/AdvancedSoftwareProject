const express = require ("express");
const port = 3000;
const axios = require('axios');
const passport = require('passport');
const LinkedInStrategy = require('passport-linkedin-oauth2').Strategy;
let accessToken = null;



const { app, mysql, upload } = require("./config/myConn");
app.use(express.urlencoded({extended: true})); // New
// Parse application/json
//////
app.use(express.json()); // New

const con  = mysql.createConnection({
  connectionLimit : 10,
  host            : 'localhost',
  user            : 'root',
  password        : '',
  database        : 'advancedsoftwareproject'
});

//External API to search for linkedin jobs
app.post('/jobsearch', async (req, res) => {
  const options = {
    method: 'POST',
    url: 'https://linkedin-jobs-search.p.rapidapi.com/',
    headers: {
      'content-type': 'application/json',
      'X-RapidAPI-Key': 'c3f4089899msh47b5fadecce9088p1c9f0bjsn6de18817a9b4',
      'X-RapidAPI-Host': 'linkedin-jobs-search.p.rapidapi.com'
    },
    data: {
      search_terms: req.body.search_terms,
      location: req.body.location,
      page: req.body.page
    }
  };

  try {
    const response = await axios.request(options);
    return res.json(response.data);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: 'An error occurred during the job search.' });
  }
});

//External API to search for indeed jobs
app.post('/indeedJobSearch',async(req,res)=>{
  const axios = require('axios');

const options = {
  method: 'POST',
  url: 'https://indeed11.p.rapidapi.com/',
  headers: {
    'content-type': 'application/json',
    'X-RapidAPI-Key': 'c3f4089899msh47b5fadecce9088p1c9f0bjsn6de18817a9b4',
    'X-RapidAPI-Host': 'indeed11.p.rapidapi.com'
  },
  data: {
    search_terms: req.body.search_terms,
    location: req.body.location,
    page: req.body.page
  }
};

try {
	const response = await axios.request(options);
	res.json(response.data);
} catch (error) {
	console.error(error);
}
});


app.listen(port, () => {
  console.log(`Example app listening on port ${port}!`);
});

