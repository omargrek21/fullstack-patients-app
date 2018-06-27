var express = require('express'),
    router = express.Router(),
    db = require('../models'),
    fs = require('fs'),
    csv = require('fast-csv'),
    fileUpload = require('express-fileupload');
    const UPLOAD_PATH = './uploads/';
    
router.post('/', (req,res) => {
    if (!req.files) return res.status(400).json({error:'No file uploaded'});
    let csvFile = req.files.selectedFile;
    const csvPath = UPLOAD_PATH + csvFile.name;
    const cleanData = req.body.cleanData;
    const fileSaved = csvFile.mv(csvPath, (err) => {
                        if (err) return res.status(500).json(err);
                        console.log("File uploaded and saved successfully");
                        return true;
                    });
    console.log("typeof:", typeof fileSaved);
    console.log("fileSaved:", fileSaved);
    if(fileSaved){
        console.log("entro en fileSaved");
        let patientsData = async () => await parseData(csvPath, res);
        if(cleanData === 'true'){
            const insurance_company = patientsData[0].insurance_company;
            console.log("Limpieza de datos previos de aseguradora:", insurance_company);
            let dataErased = async() => await cleanDB(insurance_company);
        }
        let dataInserted = async () => await saveToDb(patientsData);
        const uploadObject = {
            uploaded:true, 
            path: csvPath,
            records_parsed: patientsData.length,
            recors_inserted: dataInserted.length
        };
        res.json(uploadObject);
    }
});



async function parseData(path, res){
    let patientsArr = [];
    var stream = fs.createReadStream(path);
    csv
     .fromStream(stream, {headers: ["dni", "titular_dni", "full_name", "birth_date", "location", "type", "owner", "branch", "insurance_company"]})
     .on("data", function(data){
         patientsArr.push(data);
     })
     .on("end", function(){
         console.log(".csv file read ended");
         return patientsArr;
         /*if(cleanData === 'true'){
            const insurance_company = patientsArr[0].insurance_company;
            console.log("Limpieza de datos previos de aseguradora:", insurance_company);
            let dataErased = async() => await cleanDB(insurance_company);
         }
         console.log("csv read ended");
         const uploadObject = {
             upload:true, 
             path: path,
             records_readed: patientsArr.length
         };
         saveToDb(patientsArr,res, uploadObject); */
     }); 
}

async function saveToDb(data){
    db.Patient.collection.insert(data)
    .then(function(newData){
        return newData;
    })
    .catch(function(err){
        return err;
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

async function cleanDB(insurance_company){
    db.Patient.deleteMany({ "insurance_company" : insurance_company })
    .then(function(response){
        return response;
    })
    .catch(function(err){
        return err;
    })
}

module.exports = router;