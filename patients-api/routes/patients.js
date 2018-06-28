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
        const customError = `Error: ${err}`;
        console.log(customError);
        return res.status(400).json({error:customError});
   }); 
});

router.get('/:patientDni', function(req,res){
    db.Patient.find({'titular_dni': req.params.patientDni})
    .then(function(patients){
        res.json(patients);
    })
    .catch(function(err){
        const customError = `Error: ${err}`;
        console.log(customError);
        return res.status(400).json({error:customError});
    }); 
});

router.post('/', (req,res) => {
    if (!req.files) return res.status(400).json({error:'Error: no se ha recibido ningún archivo en el servidor'});
    let csvFile = req.files.selectedFile;
    const csvPath = UPLOAD_PATH + csvFile.name;
    const cleanData = req.body.cleanData;
    csvFile.mv(csvPath, (err) => {
        if (err) return res.status(500).json(err);
        console.log("Archivo recibido y guardado exitosamente en:", UPLOAD_PATH);
        processFile(csvPath,cleanData,res);
    });
});
    
async function processFile(csvPath,cleanData,res){
    let patientsData = [];
    try {
        patientsData = await parseData(csvPath);
        console.log(`Lectura del archivo ${csvPath} completada con ${patientsData.length} registros`);
    } catch(e){
        const customError = `Error durante la lectura del archivo ${csvPath}`;
        console.log(customError);
        return res.status(400).json({error:customError});
    }
    
    if(cleanData === 'true'){
        const insurance_company = patientsData[0].insurance_company;
        try {
            let dataErased = await cleanDB(insurance_company);
            console.log(`Data previa de ${insurance_company} eliminada exitosamente`);
        } catch(e){
            const customError = `Error eliminando data previa de ${insurance_company}`;
            console.log(customError);
            return res.status(400).json({error:customError});
        }
    }
    
    try {
        let dataInserted = await saveToDb(patientsData);
        console.log(`${dataInserted.insertedCount} registros guardados en base de datos exitosamente`);
        const uploadObject = {
            success:true, 
            path: csvPath,
            records_parsed: patientsData.length, 
            records_inserted: dataInserted.insertedCount,
            db_result: dataInserted.result
        };
        res.json(uploadObject);
    } catch(e){
        const customError = `Error guardando los registros en la base de datos`;
        console.log(customError);
        return res.status(400).json({error:customError});
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
}

async function cleanDB(insurance_company){
    return db.Patient.deleteMany({"insurance_company" : insurance_company});
}

module.exports = router;