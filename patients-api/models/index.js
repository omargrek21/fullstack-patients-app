var mongoose = require('mongoose');
mongoose.set('debug', true);
mongoose.connect('mongodb://localhost/todo-api', {keepAlive: true});

mongoose.Promise = Promise; //allow Promise sintax
module.exports.Patient = require('./patient');
module.exports.User = require('./user');
module.exports.Client = require('./client');