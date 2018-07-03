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
       res.json({
           success: true,
           patients: patients
       });
   })
   .catch(function(err){
       handleError(res,err,'Ha ocurrido un error obteniendo la data');
   }); 
});

router.get('/:patientDni', function(req,res){
    db.Patient.find({'titular_dni': req.params.patientDni})
    .then(function(patients){
        res.json({
           success: true,
           patients: patients
       });
    })
    .catch(function(err){
        handleError(res,err,'Ha ocurrido un error obteniendo la data');
    }); 
});

router.post('/', (req,res) => {
    if (!req.files) return res.status(400).json({errorMsg:'¡No has cargado ningún archivo, intenta de nuevo!', errorDetail:'No file uploaded'});
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
        handleError(res,e,`Error en la lectura del archivo en la linea ${e}, verifique su estructura`);
    }
    
    if(cleanData === 'true'){
        const insurance_company = patientsData[0].insurance_company;
        try {
            let dataErased = await cleanDB(insurance_company);
            console.log(`Data previa de ${insurance_company} eliminada exitosamente`);
        } catch(e){
            handleError(res,e,`Error eliminando data previa de ${insurance_company}`);
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
        handleError(res,e,`Error guardando los registros en la base de datos`);
    } 
}

function parseData(path){
    return new Promise(function(resolve,reject){
        let patientsArr = [];
        let rowFlag = 0;
        var stream = fs.createReadStream(path);
        try{
            csv
            .fromStream(stream, {headers: ["dni", "titular_dni", "full_name", "birth_date", "location", "type", "owner", "branch", "insurance_company"]})
             .on("data", function(data){
                 rowFlag++;
                 patientsArr.push(data);
             })
             .on("end", function(){
                resolve(patientsArr); 
             })
             .on("error", function(e){
                reject(rowFlag);
             })
            
        } catch(e) {
            reject(rowFlag);
        }
    });
}

async function saveToDb(data){
    return db.Patient.collection.insert(data);
}

async function cleanDB(insurance_company){
    return db.Patient.deleteMany({"insurance_company" : insurance_company});
}

function handleError(res,err,msg){
    return res.status(400).json({
        errorMsg: msg,
        errorDetail:err
    });
}

module.exports = router;