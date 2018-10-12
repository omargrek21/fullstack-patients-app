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
    let records_inserted = 0;
    try {
        const data = await parseData(csvPath);
        patientsData = data.patients;
        insurances = data.insurances;
        debug(`Lectura del archivo ${csvPath} completada con ${patientsData.length} registros`);
    } catch(e){
        return next({
            status:400,
            message:`Error en la lectura del archivo en la linea ${e}, verifique su estructura`
        });
    }
    
    /*try {
        for(let insurance_code of insurances){
            await db.Patient.deleteMany({insurance_code});
        }
    } catch(e){
        return next({
            status:400,
            message:`Error limpiando DB`
        })
    } */
    
    try {
        let bulk = db.Patient.collection.initializeUnorderedBulkOp();
        const batchSize = 50000;
        let records_inserted = 0;
        let counter = 0;
        for (let i = 0; i < patientsData.length; i++) {
            if(counter == batchSize){
                const partialResult = await bulk.execute({ w: "majority", wtimeout: 1000 });
                console.log("Internal bulk executed");
                console.log("inserted by internal bulk: ", partialResult.nInserted);
                records_inserted += partialResult.nInserted;
                bulk = db.Patient.collection.initializeUnorderedBulkOp();
                counter = 0;
            } else {
                bulk.insert(patientsData[i]);
                counter++;
            }
        }
        const uploadResult = await bulk.execute({ w: "majority", wtimeout: 1000 });
        console.log("External bulk executed");
        console.log("inserted by external bulk: ", uploadResult.nInserted);
        records_inserted += uploadResult.nInserted;
        console.log("compare started");
        
        let not_added_data = [];
        for (let i = 0; i < patientsData.length; i++) {
            const { _id } = patientsData[i];
            const found = await db.Patient.findById(_id);
            if(!found){
                not_added_data.push(patientsData[i]);
            }
        }
        console.log(not_added_data);
        console.log("compare finished");
        const uploadObject = {
            success:true, 
            path: csvPath,
            records_inserted,
            not_added_data
        };
        res.status(200).json(uploadObject);
    } catch(e){
        return next({
            status:400,
            message:`Error guardando los registros en la base de datos: ${e}`
        });
    } 
}

async function parseData(path){
    return new Promise(function(resolve,reject){
        let patients = [];
        let insurances = new Set();
        let rowFlag = 0;
        let stream = fs.createReadStream(path);
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

