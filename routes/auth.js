
var LinkedIn = require('node-linkedin')('7781rvz75h5xk8', 'FRuMDclrr7r9Kh3L');


// Redirect the user to the LinkedIn authorization page
exports.getAuthorizationUrl = function(){
  return LinkedIn.auth.authorizeUrl({
    redirect_uri: 'http://localhost:3000/LinkedIn/auth/linkedin/callback',
    state: 'myState'
  });
};

// Handle the callback from the LinkedIn authorization page and return the access token
exports.getAccessToken = function(code, callback) {
    LinkedIn.auth.getAccessToken(code, 'http://localhost:3000/LinkedIn/auth/linkedin/callback', function(err, results) {
      if (err) {
        return callback(err);
      } else {
        var accessToken = results.access_token;
        callback(null, accessToken);
      }
    });
  };
  
