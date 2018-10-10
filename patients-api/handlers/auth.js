const db = require('../models');
const jwt = require('jsonwebtoken');

exports.signin = async function(req,res,next){
    try {
        let user = await db.User.findOne({username: req.body.username});
        let {id,username,role,email,name,lastname} = user;
        let auth = await user.comparePassword(req.body.password);
        if(auth){
            let token = jwt.sign({id,username,role,email,name,lastname}, process.env.SECRET_KEY);
            return res.status(200).json({
                auth,
                id,
                username,
                name,
                lastname,
                role,
                email,
                token
            });
        } else {
            return next({
                status:400,
                message:"Usuario y/o contraseña incorrectos"
            })
        }   
    } catch (err) {
        return next({
            status:400,
            message:"Usuario y/o contraseña incorrectos"
        })
    }
}

exports.signup = async function(req, res, next) {
    try{
        let user = await db.User.create(req.body);
        let { id, username, email, role, name, lastname} = user;
        let token = jwt.sign(
            {
                id,
                username,
                role,
                email,
                name,
                lastname
            },
            process.env.SECRET_KEY
        );
        return res.status(200).json({
            sucess:true,
            id,
            username,
            email,
            role,
            token
        });   
        
    } catch(err){
        if (err.code === 11000) {
            err.message = "Usuario ya existe";
          }
          return next({
            status: 400,
            message: err.message
        });
    }
}

exports.list = async function(req, res, next) {
    try{
        let users = await db.User.find().limit(20);
        return res.status(200).json({
            sucess:true,
            users
        });
        
    } catch(err){
        return next({
            status:400,
            message:"error obteniendo los usuarios"
        })
    }
}

