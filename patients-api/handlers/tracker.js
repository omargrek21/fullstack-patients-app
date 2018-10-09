const db = require('../models');

exports.list = async function(req,res,next){
    try{
        let patients = await db.Patient.find({device_phone:{ $ne: null }});
        return res.status(200).json({success:true,patients});
    } catch(err){
        return next({
            status:400,
            message:"Unable to list patients, err: " + err
        });
    }
};

exports.create = async function(req,res,next){
    try{
        let patient_created = await db.Patient.create(req.body);
        return res.status(201).json({success:true,patient_created});
    } catch(err){
        return next({
            status:400,
            message:"Unable to add new patient, err: " + err
        });
    }
};

exports.update = async function(req,res,next){
    try{
        const device_phone = req.body.device_phone;
        const updated_patient = await db.Patient.findOneAndUpdate({device_phone}, req.body , {new:true});
        if(updated_patient){
            return res.status(200).json({success:true,updated_patient});
        } else {
            return res.status(200).json({success:false,updated_patient});
        }
    } catch(err){
        return next({
            status:400,
            message:"Unable to update patient, err: " + err
        });
    }
};

exports.remove = async function(req,res,next){
    try{
        const result = await db.Patient.remove(req.body);
        if(result.n>0){
            return res.status(200).json({success:true,message:'Patient deleted successfully'});
        } else {
            return res.status(200).json({success:false,message:'No patient found'});
        }
        
    } catch(err){
        return next({
            status:400,
            message:"Unable to remove patient, err: " + err
        });
    }
};