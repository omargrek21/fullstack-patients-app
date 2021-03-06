const db = require('../models');
const debug = require('debug')('/api/patients:search');
/*const insuranceList = [
    {1: 'Seguros Caracas'},
    {2: 'Mercantil Seguros'},
    {3: 'Seguros la Previsora'},
    {4: 'Seguros Horizonte'},
    {5: 'Seguros La Occidental'},
    {6: 'SENIAT'},
    {7: 'Arubaanse Luchtvaart Maatschappij C A'},
    {9: 'Uniseguros'},
    {10: 'Venemergencia Elite'},
    {11: 'Seguros Federal'},
    {12: 'Grupo ATB'},
    {13: 'CAF'},
    {14: 'Inversiones 270208 Casa Blanca'},
    {15: 'Inversiones Arregui'},
    {16: 'Italcambio'},
    {17: 'Malabar group CA (rest Lola)'},
    {18: 'Mas Que Digital - Estrategia Reputacional 2020'},
    {19: 'Multinacional de seguros'},
    {20: 'SIMBIO'},
    {21: 'TEBCA'},
    {22: 'VC Medios'},
];*/


exports.find = async function(req,res,next){
    debug(`${req.method} ${req.url}`);
    const dni = req.params.patientDni;
    try{
        if(dni.length > 9){//lifeAlert
            const patients = await db.Customer.find({device_phone:dni});
            res.status(200).json({
               success: true,
               patients,
               beneficiaries: [],
               type:'gps'
            });
            
        } else {//traditional
            const patientsData = await Promise.all([
                db.Patient.find({dni}),
                db.Patient.find({'titular_dni': dni})
            ]);
            const patients = patientsData[0];
            const beneficiaries = patientsData[1].filter(patient =>patient.titular_dni != patient.dni);
            res.status(200).json({
               success: true,
               patients,
               beneficiaries,
               type:'traditional'
            });
        }
        
        
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
        message:"CI o teléfono invalido"
    })
}

