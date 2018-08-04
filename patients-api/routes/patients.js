const debug = require('debug')('/api/patients'),
    express = require('express'),
    router = express.Router(),
    { find, empty } = require('../handlers/find'),
    { upload } = require('../handlers/upload');

router.get('/', empty);
router.get('/:patientDni', find);
router.post('/',upload);
module.exports = router;


