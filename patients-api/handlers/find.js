const db = require('../models');
const debug = require('debug')('/api/patients:search');

exports.find = async function(req,res,next){
    debug(`${req.method} ${req.url}`);
    try{
        let patients = await db.Patient.find({'dni': req.params.patientDni});
        res.status(200).json({
           success: true,
           patients
        });
    } catch (e){
        return next({
            status:400,
            message:"Ha ocurrido un error obteniendo la data"
        })
    }
}

exports.empty = async function(req,res,next){
    return next({
        status:400,
        message:"Debes introducir una cédula"
    })
}

