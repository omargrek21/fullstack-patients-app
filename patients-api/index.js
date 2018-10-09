require("dotenv").config()
const debug = require('debug')('http'),
    express = require('express'),
    app = express(),
    cors = require("cors"),
    port = process.env.PORT || 3000,
    patientRoutes = require('./routes/patients'),
    userRoutes = require('./routes/users'),
    clientRoutes = require('./routes/clients'),
    trackerRoutes = require('./routes/tracker-patients'),
    errorHandler = require("./handlers/error"),
    bodyParser = require('body-parser'),
    fileUpload = require('express-fileupload'),
    helmet = require('helmet'),
    { loginRequired, ensureCorrectUser } = require("./middleware/auth"),
    path = require("path");
    
//some middlewares
app.use(cors());
app.use(helmet());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));
app.use(fileUpload());
app.use(express.static(path.join(__dirname, 'public')));
//routes
app.use('/api/patients', loginRequired, patientRoutes);
app.use('/api/users', userRoutes);
app.use('/api/clients', clientRoutes);
app.use('/api/tracker/patients',loginRequired, trackerRoutes);
app.all('/*', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});
app.use(function(req,res,next){    
    let err = new Error("Not found");
    err.status = 404;
    next(err);
});
app.use(errorHandler);

app.listen(port, function(){
    debug(`Server running on port: ${port}`);
})