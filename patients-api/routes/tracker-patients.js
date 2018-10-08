const debug = require('debug')('/api/tracker-patients'),
    express = require('express'),
    router = express.Router(),
    { list, create, update, remove } = require('../handlers/tracker');
    
router.route('/')
    .get(list)
    .post(create)
    .put(update)
    .delete(remove);
module.exports = router;




