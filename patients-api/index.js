var express = require('express'),
    app = express(),
    port = process.env.PORT || 3000,
    patientRoutes = require('./routes/patients'),
    fs = require('fs'),
    csv = require('fast-csv'),
    bodyParser = require('body-parser'),
    fileUpload = require('express-fileupload');
    
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));
app.use(fileUpload());

app.get('/', function(req, res){
    /*let patientsArr = [];
    var stream = fs.createReadStream("csvexample.csv");
    csv
     .fromStream(stream, {headers: ["dni", "titular_dni", "full_name", "birth_date", "location", "type", "owner", "branch", "insurance_company"]})
     .on("data", function(data){
         patientsArr.push(data);
     })
     .on("end", function(){
         console.log("done test");
         console.log(patientsArr.length);
     });
     console.log("ejecutando"); */
    console.log("hello from the root route")
    res.send("hello from the root route");
});

app.use('/api/patients', patientRoutes);

app.listen(port, function(){
    console.log("APP IS RUNNING ON PORT " + port);
})