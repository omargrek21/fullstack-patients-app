var express = require('express'),
    router = express.Router(),
    db = require('../models'),
    fs = require('fs'),
    csv = require('fast-csv'),
    fileUpload = require('express-fileupload');
    const UPLOAD_PATH = './uploads/';

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

router.get('/:patientDni', function(req,res){
    db.Patient.find({'titular_dni': req.params.patientDni})
    .then(function(patients){
        res.json(patients);
    })
    .catch(function(err){
        res.send(err);
    }); 
});

router.post('/', (req,res) => {
    if (!req.files) return res.status(400).json({error:'No se ha recibido archivo'});
    let csvFile = req.files.selectedFile;
    const csvPath = UPLOAD_PATH + csvFile.name;
    const cleanData = req.body.cleanData;
    csvFile.mv(csvPath, (err) => {
        if (err) return res.status(500).json(err);
        console.log("File uploaded and saved successfully");
        processFile(csvPath,cleanData,res);
    });
});
    
async function processFile(csvPath,cleanData,res){
    let patientsData = [];
    try {
        patientsData = await parseData(csvPath);
        console.log("Data parseada");
    } catch(e){
        console.log("Error parseando archivo");
    }
    
    if(cleanData === 'true'){
        const insurance_company = patientsData[0].insurance_company;
        console.log("Limpieza de datos previos de aseguradora:", insurance_company);
        try {
            let dataErased = await cleanDB(insurance_company);
            console.log("data eliminada");
        } catch(e){
            console.log("Error borrando data");
        }
    }
    
    try {
        let dataInserted = await saveToDb(patientsData);
        console.log("data guardada en bd");
        const uploadObject = {
            uploaded:true, 
            path: csvPath,
            records_parsed: patientsData.length
        };
        res.json(uploadObject);
    } catch(e){
        console.log("Error subiendo data");
    } 
}



function parseData(path){
    return new Promise(function(resolve,reject){
        let patientsArr = [];
        var stream = fs.createReadStream(path);
        csv
         .fromStream(stream, {headers: ["dni", "titular_dni", "full_name", "birth_date", "location", "type", "owner", "branch", "insurance_company"]})
         .on("data", function(data){
             patientsArr.push(data);
         })
         .on("end", function(){
             if(patientsArr.length > 0){
                resolve(patientsArr); 
             }
             else {
                reject('Error parsing .csv file');
             }
         }); 
    });
}

async function saveToDb(data){
    return db.Patient.collection.insert(data);
    /*.then(function(newData){
        return newData;
    })
    .catch(function(err){
        return err;
    });*/
}




async function cleanDB(insurance_company){
    return db.Patient.deleteMany({ "insurance_company" : insurance_company });
    /*.then(function(response){
        return response;
    })
    .catch(function(err){
        return err;
    })*/
}

module.exports = router;