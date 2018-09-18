const express = require('express'),
    router = express.Router(),
    db = require('../models'),
    { signup, signin, list } = require('../handlers/auth');

router.post('/signin',signin);
router.post('/signup',signup);
router.get('/getAll',list);

module.exports = router;


