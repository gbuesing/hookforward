var request = require('request');

module.exports = function(db_url) {
  var doc = {
    "_id": 'test-' + Date.now(),
    "type": "webhook",
    "created_at": (new Date()).toJSON(),
    "req": {
      "method": "POST",
      "body": '{"type": "test", "created_at": "' + (new Date()).toJSON() + '"}',
      "headers": {
        "Content-Type": "application/json"
      }
    }
  };

  request.put({url: db_url + '/' + doc['_id'], json: doc}, function(error, response, body) {
    if (error) {
      console.log("Error pushing test doc: " + error);
    } else {
      console.log(body);
      console.log("Test doc pushed.");
    }
  });
}
