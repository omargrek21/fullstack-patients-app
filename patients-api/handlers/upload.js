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
    try {
        patientsData = await parseData(csvPath);
        debug(`Lectura del archivo ${csvPath} completada con ${patientsData.length} registros`);
    } catch(e){
        return next({
            status:400,
            message:`Error en la lectura del archivo en la linea ${e}, verifique su estructura`
        });
    }
    try {
        await saveToDb(patientsData);
        const uploadObject = {
            success:true, 
            path: csvPath,
            records_parsed: patientsData.length
        };
        res.status(200).json(uploadObject);
    } catch(e){
        return next({
            status:400,
            message:`Error guardando los registros en la base de datos`
        })
    } 
}

async function parseData(path){
    return new Promise(function(resolve,reject){
        let patientsArr = [];
        let rowFlag = 0;
        var stream = fs.createReadStream(path);
        try{
            csv
            .fromStream(stream, {headers: ["dni", "titular_dni", "full_name", "birth_date", "location", "type", "owner", "branch", "insurance_company", "insurance_code"]})
             .on("data", function(data){
                 rowFlag++;
                 patientsArr.push(data);
             })
             .on("end", function(){
               resolve(patientsArr); 
             })
             .on("error", function(e){
                reject(rowFlag);
             });
            
        } catch(e) {
            reject(rowFlag);
        }
    });
}

async function saveToDb(data){
    await db.Patient.updateMany({}, { $set: { status: false } });
    await data.forEach(async patient => {
        const { dni, titular_dni, full_name, birth_date, location, type, owner, branch, insurance_company, insurance_code } = patient;
        await db.Patient.update(
          { dni, titular_dni, birth_date },
          { $set: { dni, titular_dni, full_name, birth_date, location, type, owner, branch, insurance_company, insurance_code, "status": true, modified_date:Date.now() } },
          { upsert: true }
        );
    });
}
