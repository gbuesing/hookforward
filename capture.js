function(doc, req) {
  var newdoc = {
    _id: req.uuid,
    type: 'webhook',
    req: req,
    created_at: new Date()
  }

  return [newdoc, 'OK'];
}