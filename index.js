const express = require ("express");
const port = 3000;
const axios = require('axios');
const passport = require('passport');
const LinkedInStrategy = require('passport-linkedin-oauth2').Strategy;
let accessToken = null;



const { app, mysql, upload } = require("./config/myConn");
app.use(express.urlencoded({extended: true})); // New
// Parse application/json
app.use(express.json()); // New

//Routes Initialization
const appsRoutes = require("./routes/Applications");
const jobsRoutes = require("./routes/JobSearch");


//Using Routes
app.use("/apps", appsRoutes);
app.use("/jobs", jobsRoutes);

// Configure passport and LinkedIn strategy
passport.use(
  new LinkedInStrategy(
    {
      clientID: '7781rvz75h5xk8',
      clientSecret: 'FRuMDclrr7r9Kh3L',
      callbackURL: 'http://localhost:3000/auth/linkedin/callback',
      scope: ['r_liteprofile', 'r_emailaddress' ], // Specify the permissions you require // Specify the permissions you require
    },
    (token, refreshToken, profile, done) => {
      // Store the access token


      accessToken = token;
      return done(null, { accessToken, profile });
    }
  )
);

// Initialize passport middleware
app.use(passport.initialize());

// Define the authentication route to sign in to linkedIn
app.get('/auth/linkedin', passport.authenticate('linkedin', { session: false, successRedirect: 'https://www.linkedin.com' }));


// Define the callback route to use after sign in successfully
app.get('/auth/linkedin/callback', passport.authenticate('linkedin', { session: false }), async (req, res) => {
  res.redirect('https://www.linkedin.com');
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