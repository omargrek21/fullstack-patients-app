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
        let insertedCount = 0;
        let counter = 0;
        let specialArr = [];
        
        for (let i = 0; i < patientsData.length; i++) {
            if(counter == batchSize){
                specialArr.push(bulk);
                /*const partialResult = await bulk.execute({ w: "majority", wtimeout: 1000 });
                console.log("Internal bulk executed");
                console.log("inserted by internal bulk: ", partialResult.nInserted);
                insertedCount += partialResult.nInserted;*/
                bulk = db.Patient.collection.initializeUnorderedBulkOp();
                counter = 0;
            } else {
                bulk.insert(patientsData[i]);
                counter++;
            }
        }
        specialArr.push(bulk);
        await specialArr.forEach(bulk => {
             const tuleke = bulk.execute({ w: "majority", wtimeout: 1000 });
             console.log("special bulk executed");
             console.log("inserted by internal bulk: ", tuleke.nInserted);
             insertedCount += tuleke.nInserted;
        });
       // const uploadResult = await bulk.execute({ w: "majority", wtimeout: 1000 });
        //console.log("*External bulk executed*");
        //const records_inserted = insertedCount + uploadResult.nInserted;
        const records_inserted = insertedCount;
        
        /*patientsData.forEach((item,index) => {
            bulk.insert(item);
            if (index % batchSize == 0) {
                await bulk.execute();
            }
        });*/
        /*for(const patient of patientsData){
            bulk.insert(item);
            if (index % batchSize == 0) {
                await bulk.execute();
            }
        }*/
        //const uploadResult = await bulk.execute();
     
        //const result = await db.Patient.collection.bulkWrite()
        //const records_inserted = 21;//uploadResult.nInserted;
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

