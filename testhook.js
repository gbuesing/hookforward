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
    } else if (!isSuccessCode(response.statusCode)) {
      console.log("Error posting test hook: server returned " + response.statusCode);
    } else {
      console.log(body);
    }
  });

  function isSuccessCode(code) {
    return code >= 200 && code < 300;
  }
}
