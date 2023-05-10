
var LinkedIn = require('node-linkedin')('7781rvz75h5xk8', 'FRuMDclrr7r9Kh3L');
exports.searchJobs = function(accessToken, keywords, location, callback) {
  var linkedin = LinkedIn.init(accessToken);
  linkedin.jobSearch({
    keywords: keywords,
    location: location,
    sortOrder: 'DD'
  }, function(err, data) {
    if (err) {
      return callback(err);
    } else {
      callback(null, data);
    }
  });
};
