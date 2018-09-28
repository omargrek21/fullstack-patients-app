const debug = require('debug')('/api/clients'),
    express = require('express'),
    router = express.Router(),
    db = require('../models'),
    { getClients, addClients, removeClients } = require('../handlers/clients');

router.get('/list',getClients);
router.post('/add',addClients);
router.post('/remove',removeClients);

module.exports = router;
    