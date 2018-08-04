const db = require('../models');
const debug = require('debug')('/api/clients');

exports.getClients = async function(req,res,next){
    try{
        let clients = await db.Client.find({status:true});
        return res.status(200).json({
            sucess:true,
            clients
        });
    } catch(err){
        return next({
            status:400,
            message:"Unable to find clients"
        })
    }
}

exports.addClients = async function(req,res,next){
    try{
        let newClients = await db.Client.collection.insert(req.body);
        return res.status(201).json({sucess:true,newClients});
    } catch(err){
        return next({
            status:400,
            message:"Unable to add new data"
        })
    }
}