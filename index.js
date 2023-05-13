const express = require("express");
const app = express();
const mysql = require('mysql');
const port = 3000;

app.use(express.urlencoded({extended: true})); // New
// Parse application/json
//////
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

con.connect((err)=>{
if(err){
  console.log(err);}
  else console.log("Connected");
});

app.get("/", (req, res) => {
  res.send("Hello World!");
});

app.listen(port, () => {
  console.log(`Example app listening on port ${port}!`);
});

