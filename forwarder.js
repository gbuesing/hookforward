var follow = require('follow');
var request = require('request');


module.exports = function(db_url, handler_url) {

  function isSuccessCode(code) {
    return code >= 200 && code < 300;
  }

  function forwardHook(doc) {
    request({
      url: handler_url,
      method: doc.req.method,
      body: doc.req.body,
      headers: {
        'Content-type': doc.req.headers["Content-Type"]
      }
    }, function (error, response, body) {
      if (error) {
        console.log("Error forwarding hook: " + error);
      } else if (!isSuccessCode(response.statusCode)) {
        console.log("Error forwarding hook: server returned " + response.statusCode);
      } else {
        console.log("Forwarded webhook id: " + doc._id);
      }
    });
  }

  follow({db: db_url, include_docs:true, since: 'now'}, function(error, change) {
    if (error) {
      console.log("Error following changes: " + error);
    } else {
      var doc = change.doc;

      if (doc.type === 'webhook') {
        forwardHook(doc);
      }
    }
  });

  console.log("Hookforward is listening for changes...");
}

