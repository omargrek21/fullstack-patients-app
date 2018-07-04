var express = require('express'),
    router = express.Router(),
    db = require('../models')
    

router.post('/login', function(req,res){
    db.User.find({'username': req.body.username})
    .then(function(user){
        let auth = false;
        const password = user[0].password;
        if(req.body.password === password){
          auth = true;
        }
        res.json({
           auth,
           userFound: user,
           userPost: req.body
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