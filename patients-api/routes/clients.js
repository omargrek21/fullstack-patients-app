const debug = require('debug')('/api/clients'),
    express = require('express'),
    router = express.Router(),
    db = require('../models'),
    { getClients, addClients } = require('../handlers/clients');

router
  .route("/")
  .get(getClients)
  .post(addClients);
module.exports = router;
    