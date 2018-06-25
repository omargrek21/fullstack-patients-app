var express = require('express'),
    router = express.Router(),
    db = require('../models'),
    fs = require('fs'),
    csv = require('fast-csv'),
    fileUpload = require('express-fileupload');
    const UPLOAD_PATH = './uploads/';
    
router.post('/', (req,res) => {
   if (!req.files)
    return res.status(400).json({error:'No file uploaded'});
    let csvFile = req.files.selectedFile;
    const csvPath = UPLOAD_PATH + csvFile.name;
    
    csvFile.mv(csvPath, (err) => {
    if (err) return res.status(500).json(err);
    console.log("upload sucess");
    parseData(csvPath, res);
    
  
    
  });
});


function parseData(path, res){
    let patientsArr = [];
    var stream = fs.createReadStream(path);
    csv
     .fromStream(stream, {headers: ["dni", "titular_dni", "full_name", "birth_date", "location", "type", "owner", "branch", "insurance_company"]})
     .on("data", function(data){
         patientsArr.push(data);
         
     })
     .on("end", function(){
         console.log("csv read ended");
         const uploadObject = {
             upload:'sucess', 
             path: path,
             records_readed: patientsArr.length
         };
         
         saveToDb(patientsArr,res, uploadObject);
         
     }); 
}

function saveToDb(data, res, uploadObject){
    
    db.Patient.deleteMany()
            .then(function(response){
                console.log(response);
            })
            .catch(function(err){
                console.log(err);
            })
    
    db.Patient.create(data)
    .then(function(newData){
        db.Patient.find({ 'titular_dni': '19087165' })
        .then(function(patients){
            res.json(patients);
        })
        .catch(function(err){
            res.send(err);
        }); 
        /*let response = {...uploadObject, 'data_created_on_db' : true, ...newData};
        res.json(response);*/
    })
    .catch(function(err){
        res.send(err);
    });

}

/*to delete
    db.Patient.deleteMany()
            .then(function(response){
                res.json(response);
            })
            .catch(function(err){
                res.send(err);
            })
*/

router.get('/', function(req,res) {
   //res.send("hello from patients routes"); 
   console.log("hello from Patients route");
    /*let patientsArr = [];
    
    var stream = fs.createReadStream("csvexample.csv");
    csv
     .fromStream(stream, {headers: ["dni", "titular_dni", "full_name", "birth_date", "location", "type", "owner", "branch", "insurance_company"]})
     .on("data", function(data){
         patientsArr.push(data);
     })
     .on("end", function(){
         console.log("done test");
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