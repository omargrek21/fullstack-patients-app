const express = require('express'),
    router = express.Router(),
    { signup, signin, list } = require('../handlers/auth'),
    { loginRequired, ensureCorrectUser } = require("../middleware/auth");

router.post('/signin',signin);
router.post('/signup', loginRequired, ensureCorrectUser, signup);
router.get('/getAll', loginRequired, ensureCorrectUser, list);

module.exports = router;


