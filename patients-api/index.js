require("dotenv").config()
const debug = require('debug')('http'),
    express = require('express'),
    app = express(),
    cors = require("cors"),
    port = process.env.PORT || 3000,
    patientRoutes = require('./routes/patients'),
    userRoutes = require('./routes/users'),
    clientRoutes = require('./routes/clients'),
    errorHandler = require("./handlers/error"),
    bodyParser = require('body-parser'),
    fileUpload = require('express-fileupload'),
    helmet = require('helmet');
    
//some middlewares
app.use(helmet());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));
app.use(fileUpload());
//routes
app.use('/api/patients', patientRoutes);
app.use('/api/users', userRoutes);
app.use('/api/clients', clientRoutes);
app.use(function(req,res,next){    
    let err = new Error("Not found");
    err.status = 404;
    next(err);
});
app.use(errorHandler);

app.listen(port, function(){
    debug(`Server running on port: ${port}`);
})