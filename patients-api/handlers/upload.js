const db = require('../models'),
    debug = require('debug')('/api/patients:upload'),
    fs = require('fs'),
    csv = require('fast-csv'),
    UPLOAD_PATH = process.env.UPLOAD_PATH;
    
exports.upload = async function(req,res,next){
    debug(`${req.method} ${req.url}`);
    if (!req.files){
        return next({
            status:400,
            message:"No has cargado ningún archivo"
        });
    } 
    let csvFile = req.files.selectedFile;
    const csvPath = UPLOAD_PATH + csvFile.name;
    csvFile.mv(csvPath, (err) => {
        if (err) return next(err);
        debug("Archivo recibido y guardado exitosamente en:", UPLOAD_PATH);
        processFile(csvPath,res,next);
    });
}

async function processFile(csvPath,res,next){
    let patientsData = [];
    let insurances = new Set();
    let data = {};
    try {
        data = await parseData(csvPath);
        patientsData = data.patients;
        insurances = data.insurances;
        debug(`Lectura del archivo ${csvPath} completada con ${patientsData.length} registros`);
    } catch(e){
        return next({
            status:400,
            message:`Error en la lectura del archivo en la linea ${e}, verifique su estructura`
        });
    }
    
    try {
        for(let insurance_code of insurances){
            await db.Patient.deleteMany({insurance_code});
        }
    } catch(e){
        return next({
            status:400,
            message:`Error limpiando DB`
        })
    }
    
    try {
        const uploadResult = await db.Patient.collection.insert(patientsData,{ ordered: false });
        const records_inserted = uploadResult.insertedCount;
        debug(`Finalizo con ${records_inserted} records insertados`);
        const uploadObject = {
            success:true, 
            path: csvPath,
            records_inserted
        };
        res.status(200).json(uploadObject);
    } catch(e){
        return next({
            status:400,
            message:`Error guardando los registros en la base de datos: ${e}`
        })
    } 
}

async function parseData(path){
    return new Promise(function(resolve,reject){
        let patients = [];
        let insurances = new Set();
        let rowFlag = 0;
        var stream = fs.createReadStream(path);
        try{
            csv
            .fromStream(stream, {headers: ["dni", "titular_dni", "full_name", "birth_date", "location", "type", "owner", "branch", "insurance_company", "insurance_code"]})
             .on("data", function(data){
                 rowFlag++;
                 patients.push(data);
                 insurances.add(data.insurance_code);
             })
             .on("end", function(){
               let data = {patients,insurances};
               resolve(data); 
             })
             .on("error", function(e){
                reject(rowFlag);
             });
            
        } catch(e) {
            reject(rowFlag);
        }
    });
}

