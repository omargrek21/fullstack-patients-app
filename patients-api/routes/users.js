var express = require('express'),
    router = express.Router(),
    db = require('../models')
    

router.post('/login', function(req,res){
    console.log(req.body);
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
        handleError(res,err,'Acceso no autorizado');
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

router.get('/getAll', function(req,res){
    db.User.find()
   .limit(20)
   .then(function(users){
       res.json({
           success: true,
           users: users
       });
   })
   .catch(function(err){
       handleError(res,err,'Ha ocurrido un error obteniendo la data');
   });
});

function handleError(res,err,msg){
    return res.status(400).json({
        errorMsg: msg,
        errorDetail:err
    });
}

module.exports = router;