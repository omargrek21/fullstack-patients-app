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
}

async function processFile(csvPath,cleanData,res,next){
    let patientsData = [];
    let insurance_data = {};
    
    try {
        let data_parsed = await parseData(csvPath, cleanData);
        patientsData = data_parsed.patients;
        insurance_data = data_parsed.insurance_data;
        debug(`Lectura del archivo ${csvPath} completada con ${patientsData.length} registros`);
    } catch(e){
        return next({
            status:400,
            message:`Error en la lectura del archivo en la linea ${e}, verifique su estructura`
        })
    }
    
    if(cleanData === 'true'){
        try {
            await cleanDB(Object.keys(insurance_data));
            debug(`Data previa eliminada exitosamente`);
        } catch(e){
            return next({
                status:400,
                message:`Error eliminando data previa`
            });
        }
    }
    
    try {
        let queries = [saveToDb(patientsData)];
        //let update_arr = [];
        for(let insurance in insurance_data){
            queries.push(updateInsuranceCount(cleanData,insurance,insurance_data[insurance]));
            queries.push(updateDate(insurance,insurance_data[insurance]));
        }
        
        let results = await Promise.all([...queries]);
        let dataInserted = results[0];
        //debug(`${dataInserted.insertedCount} registros guardados en base de datos exitosamente`);
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

async function parseData(path, cleanData){
    return new Promise(function(resolve,reject){
        let patientsArr = [];
        let insurance_data = {};
        let rowFlag = 0;
        var stream = fs.createReadStream(path);
        try{
            csv
            .fromStream(stream, {headers: ["dni", "titular_dni", "full_name", "birth_date", "location", "type", "owner", "branch", "insurance_company", "insurance_code"]})
             .on("data", function(data){
                 rowFlag++;
                 patientsArr.push(data);
                 if(data.insurance_code in insurance_data){
                    insurance_data[data.insurance_code]++;
                 } else{
                    insurance_data[data.insurance_code] = 1;
                 }
             })
             .on("end", function(){
               const dataParsed = {patients:patientsArr,insurance_data};
               resolve(dataParsed); 
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
    
    return db.Patient.collection.insert(data);
  
}

async function updateInsuranceCount(cleanData,insurance_code, qty){
    try{
      if(cleanData==='true'){
        return db.Client.update({insurance_code},{ $set: {qty}});
    } else{
        return db.Client.update({insurance_code},{ $inc: {qty}});
    }  
    }catch(e){
        return e
    }
    
}

async function updateDate(insurance_code,qty){
   return db.Client.update({insurance_code},{ $set: {'modified_date':Date.now()}}); 
}

async function cleanDB(insurance_codes){
    return db.Patient.deleteMany({"insurance_code" : { $in: insurance_codes }});
}