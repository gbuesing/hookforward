var request = require('request');

module.exports = function(db_url, hook_path) {
  hook_path = hook_path || '/_design/hookforward/_update/capture';
  var hook_url = db_url + hook_path;

  var doc = {
    "type": "test",
    "created_at": (new Date()).toJSON()
  }

  request.post({url: hook_url, json: doc}, function(error, response, body) {
    if (error) {
      console.log("Error posting test hook: " + error);
    } else {
      console.log(body);
    }
  });
}
