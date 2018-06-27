var express = require('express'),
    router = express.Router(),
    db = require('../models'),
    fs = require('fs'),
    csv = require('fast-csv'),
    fileUpload = require('express-fileupload');
    const UPLOAD_PATH = './uploads/';
    
router.post('/', (req,res) => {
    const cleanData = !req.body.cleanData;
    console.log("Conservar data?", cleanData);
    if (!req.files) return res.status(400).json({error:'No file uploaded'});
    let csvFile = req.files.selectedFile;
    const csvPath = UPLOAD_PATH + csvFile.name;
    csvFile.mv(csvPath, (err) => {
        if (err) return res.status(500).json(err);
        console.log("upload sucess");
        parseData(csvPath, res, cleanData);
    });
});


function parseData(path, res, cleanData){
    let patientsArr = [];
    var stream = fs.createReadStream(path);
    csv
     .fromStream(stream, {headers: ["dni", "titular_dni", "full_name", "birth_date", "location", "type", "owner", "branch", "insurance_company"]})
     .on("data", function(data){
         patientsArr.push(data);
     })
     .on("end", function(){
         console.log("cleanData (inversa) on parser is:", cleanData);
         if(!cleanData){
            console.log("Ejecutará limpieza");
            const insurance_company = patientsArr[0].insurance_company;
            cleanDB(insurance_company);
         }
         console.log("csv read ended");
         const uploadObject = {
             upload:true, 
             path: path,
             records_readed: patientsArr.length
         };
         saveToDb(patientsArr,res, uploadObject);
     }); 
}

function saveToDb(data, res, uploadObject){
    db.Patient.collection.insert(data, { writeConcern: { w: "majority", wtimeout: 900000 } })
    .then(function(newData){
        console.log("Insert finished");
        let response = {...uploadObject, 'created_on_db' : true};
        res.json(response);
    })
    .catch(function(err){
        console.log("error inserting data:", error);
        res.send(err);
    });
}

router.get('/:patientDni', function(req,res){
    db.Patient.find({ 'titular_dni': req.params.patientDni })
    .then(function(patients){
        res.json(patients);
    })
    .catch(function(err){
        res.send(err);
    }); 
});

router.get('/', function(req,res) {
   db.Patient.find()
   .limit(20)
   .then(function(patients){
       res.json(patients);
   })
   .catch(function(err){
        res.send(err);
   }); 
});

function cleanDB(insurance_company){
    db.Patient.deleteMany({ "insurance_company" : insurance_company })
    .then(function(response){
        console.log(response);
    })
    .catch(function(err){
        console.log(err);
    })
}

module.exports = router;