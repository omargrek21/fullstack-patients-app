var express = require('express'),
    router = express.Router(),
    db = require('../models');

router.get('/', function(req,res) {
   //res.send("hello from patients routes"); 
   db.Patient.find()
   .then(function(patients){
       res.json(patients);
   })
   .catch(function(err){
        res.send(err);
   });
});

module.exports = router;