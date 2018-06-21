var express = require('express'),
    app = express(),
    port = process.env.PORT || 3000,
    patientRoutes = require('./routes/patients');

app.get('/', function(req, res){
    res.send("hello from the root route");
});

app.use('/api/patients', patientRoutes);

app.listen(port, function(){
    console.log("APP IS RUNNING ON PORT " + port);
})