const debug = require('debug')('/api/patients'),
    express = require('express'),
    router = express.Router(),
    db = require('../models'),
    fs = require('fs'),
    csv = require('fast-csv'),
    fileUpload = require('express-fileupload'),
    UPLOAD_PATH = process.env.UPLOAD_PATH;
    

router.get('/', function(req,res,next) {
   db.Patient.find()
   .limit(20)
   .then(function(patients){
       res.status(200).json({
           success: true,
           patients: patients
       });
   })
   .catch(function(err){
       return next({
            status:400,
            message:"Ha ocurrido un error obteniendo la data"
        })
   }); 
});

router.get('/:patientDni', function(req,res,next){
    debug(`${req.method} ${req.url}`)
    db.Patient.find({'dni': req.params.patientDni})
    .then(function(patients){
        res.status(200).json({
           success: true,
           patients: patients
       });
    })
    .catch(function(err){
        return next({
            status:400,
            message:"Ha ocurrido un error obteniendo la data"
        })
    }); 
});

router.post('/', (req,res,next) => {
    debug(`${req.method} ${req.url}`)
    if (!req.files){
        return next({
            status:400,
            message:"No has cargado ningún archivo"
        })
    } 
    let csvFile = req.files.selectedFile;
    const csvPath = UPLOAD_PATH + csvFile.name;
    const cleanData = req.body.cleanData;
    csvFile.mv(csvPath, (err) => {
        if (err) return next(err);
        debug("Archivo recibido y guardado exitosamente en:", UPLOAD_PATH);
        processFile(csvPath,cleanData,res,next);
    });
});
    
async function processFile(csvPath,cleanData,res,next){
    let patientsData = [];
    try {
        patientsData = await parseData(csvPath);
        debug(`Lectura del archivo ${csvPath} completada con ${patientsData.length} registros`);
    } catch(e){
        return next({
            status:400,
            message:`Error en la lectura del archivo en la linea ${e}, verifique su estructura`
        })
    }
    
    if(cleanData === 'true'){
        const insurance_company = patientsData[0].insurance_company;
        try {
            let dataErased = await cleanDB(insurance_company);
            debug(`Data previa de ${insurance_company} eliminada exitosamente`);
        } catch(e){
            return next({
                status:400,
                message:`Error eliminando data previa de ${insurance_company}`
            })
        }
    }
    
    try {
        let dataInserted = await saveToDb(patientsData);
        debug(`${dataInserted.insertedCount} registros guardados en base de datos exitosamente`);
        const uploadObject = {
            success:true, 
            path: csvPath,
            records_parsed: patientsData.length, 
            records_inserted: dataInserted.insertedCount,
            db_result: dataInserted.result
        };
        res.status(200).json(uploadObject);
    } catch(e){
        return next({
            status:400,
            message:`Error guardando los registros en la base de datos`
        })
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
module.exports = router;


