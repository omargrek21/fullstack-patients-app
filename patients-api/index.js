require("dotenv").config()
const express = require('express'),
    app = express(),
    cors = require("cors"),
    port = process.env.PORT || 3000,
    patientRoutes = require('./routes/patients'),
    userRoutes = require('./routes/users'),
    errorHandler = require("./handlers/error"),
    fs = require('fs'),
    csv = require('fast-csv'),
    bodyParser = require('body-parser'),
    fileUpload = require('express-fileupload');
   // cors = require('cors'),
    //morgan = require('morgan');

//app.use(morgan('tiny'));    
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));
app.use(fileUpload());

/*app.get('/', function(req, res){
    console.log("On root route");
    res.send("On root route");
}); */

app.use('/api/patients', patientRoutes);
app.use('/api/users', userRoutes);
app.use(function(req,res,next){    
    let err = new Error("Not found");
    err.status = 404;
    next(err);
});
app.use(errorHandler);

app.listen(port, function(){
    console.log("APP IS RUNNING ON PORT " + port);
})