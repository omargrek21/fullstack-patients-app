var mongoose = require('mongoose');
mongoose.set('debug', false);
mongoose.connect('mongodb://localhost/validator', {keepAlive: true});

mongoose.Promise = Promise; //allow Promise sintax
module.exports.Patient = require('./patient');
module.exports.User = require('./user');
module.exports.Client = require('./client');