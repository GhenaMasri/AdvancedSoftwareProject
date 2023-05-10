const express = require("express");
const router = express.Router();
const { upload, con} = require("../config/myConn");
var auth = require('./auth.js');
var jobsearch = require('./jobsearchLinkedIn.js');

// Redirect the user to the LinkedIn authorization page
router.get('/auth/linkedin', function(req, res) {
  var redirectUrl = auth.getAuthorizationUrl();
  res.redirect(redirectUrl);
});

// Handle the callback from the LinkedIn authorization page
router.get('/auth/linkedin/callback', function(req, res) {
  var code = req.query.code;
  var kw = req.body.keyword;
  var location = req.body.location;

  auth.getAccessToken(code, function(err, accessToken) {
    if (err) {
      return res.status(500).json({ error: 'Failed to obtain access token' });
    } else {
      // Use the access token to search for job listings
      jobsearch.searchJobs(accessToken, kw, location, function(err, data) {
        if (err) {
          return res.status(500).json({ error: 'Failed to search for jobs' });
        } else {
          console.log(data);
          return res.status(200).json({ result: data });
        }
      });
    }
  });
});


module.exports = router;