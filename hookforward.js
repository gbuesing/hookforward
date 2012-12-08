var pusher = require('./pusher');
var forwarder = require('./forwarder');
var testhook = require('./testhook');

module.exports = forwarder;
module.exports.pushDesignDoc = pusher;
module.exports.postTestHook = testhook;