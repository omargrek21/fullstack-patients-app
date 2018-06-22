var express = require('express'),
    router = express.Router(),
    db = require('../models'),
    fs = require('fs'),
    csv = require('fast-csv');

router.get('/', function(req,res) {
   //res.send("hello from patients routes"); 
   /*console.log("starting read .csv file");
    let patientsArr = [];
    
    var stream = fs.createReadStream("csvexample.csv");
    csv
     .fromStream(stream, {headers: ["dni", "titular_dni", "full_name", "birth_date", "location", "type", "owner", "branch", "insurance_company"]})
     .on("data", function(data){
         patientsArr.push(data);
     })
     .on("end", function(){
         console.log("done");
         console.log(patientsArr);
         db.Patient.create(patientsArr)
            .then(function(newData){
                res.json(newData);
            })
            .catch(function(err){
                res.send(err);
            });
         
     }); */
     
    
   
   
   
   
   db.Patient.find()
   .then(function(patients){
       res.json(patients);
   })
   .catch(function(err){
        res.send(err);
   }); 
});

module.exports = router;