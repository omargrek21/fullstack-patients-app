const db = require('../models');
const debug = require('debug')('/api/clients');

exports.getClients = async function(req,res,next){
    try{
        let insurance_companies = await db.Client.find();
        return res.status(200).json({
            sucess:true,
            insurance_companies
        });
    } catch(err){
        return next({
            status:400,
            message:"Unable to find clients"
        });
    }
};

exports.addClients = async function(req,res,next){
    try{
        let insurance_added = await db.Client.collection.insert(req.body);
        return res.status(201).json({sucess:true,insurance_added});
    } catch(err){
        return next({
            status:400,
            message:"Unable to add new data"
        });
    }
};

exports.removeClients = async function(req,res,next){
    try{
        await Promise.all([
            db.Client.collection.remove({"insurance_code": req.body.insurance_code}),
            db.Patient.collection.deleteMany({"insurance_code" : req.body.insurance_code})
        ]);
        return res.status(200).json({sucess:true,message:'data deleted successfully'});
    } catch(err){
        return next({
            status:400,
            message:"Unable to remove data"
        });
    }
};