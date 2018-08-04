const express = require('express'),
    router = express.Router(),
    db = require('../models'),
    { signup, signin, list } = require('../handlers/auth');

router.post('/login',signin);
router.post('/register',signup);
router.get('/getAll',list);

module.exports = router;


