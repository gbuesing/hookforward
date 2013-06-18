var fs = require('fs');
var request = require('request');

var capture_fun = fs.readFileSync(__dirname + '/capture.js', 'utf8');

module.exports = function(db_url, ddoc_name) {
  var ddoc_id = "_design/" + (ddoc_name || "hookforward");
  var ddoc_url = db_url + '/'+ ddoc_id;

  var ddoc = {
    "_id": ddoc_id,
    "language": "javascript",
    "updates": {
      "capture": capture_fun
    }
  }

  function getRev(cb) {
    request.head({url: ddoc_url}, function(error, response, body) {
      if (error) {
        console.log("Error getting design doc rev: "  + error);
      } else {
        var rev, etag = response.headers.etag;
        if (etag) rev = etag.replace(/"/g, '');
        cb(rev);
      }
    });
  }

  // this PUT is idempotent -- it won't overwrite an existing DB
  function putDB(cb) {
    request.put({url: db_url}, function(error, response, body) {
      if (error) {
        console.log("Error creating DB: " + error);
      } else {
        cb();
      }
    });
  }

  function putDDoc() {
    getRev(function(rev) {
      if (rev) ddoc["_rev"] = rev;

      request.put({url: ddoc_url, json: ddoc}, function (error, response, body) {
        if (error) {
          console.log("Error putting design doc: " + error);
        } else if (!isSuccessCode(response.statusCode)) {
          console.log("Error putting design doc: server returned " + response.statusCode);
        } else {
          console.log("Couch is ready to capture POST webhooks at: \n");
          console.log(db_url + '/' + ddoc_id + '/_update/capture\n');
        }
      });
    });
  }

  function isSuccessCode(code) {
    return code >= 200 && code < 300;
  }

  putDB(putDDoc);
}
