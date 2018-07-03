var express = require('express'),
    router = express.Router(),
    db = require('../models')
    

router.post('/login', function(req,res){
    db.User.find({'username': req.body.username})
    .then(function(user){
        let logged = false;
        if(req.body.password === user.password){
          logged = true;
        }
        res.json({
           auth: logged
       });
    })
    .catch(function(err){
        handleError(res,err,'Ha ocurrido un error obteniendo la data');
    }); 
});

router.post('/register', function(req,res){
    db.User.create(req.body)
    .then(function(newUser){
        res.status(201).json({
           success: true,
           user: newUser
       });
    })
    .catch(function(err){
        handleError(res,err,'Ha ocurrido un error creando el nuevo usuario');
    }); 
});

function handleError(res,err,msg){
    return res.status(400).json({
        errorMsg: msg,
        errorDetail:err
    });
}

module.exports = router;