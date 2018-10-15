let mongoose = require('mongoose');
mongoose.set('debug', false);
mongoose.connect(`mongodb://${process.env.DB_CREDENTIALS}@localhost/validator`, {keepAlive: true});
mongoose.Promise = Promise;
module.exports.Patient = require('./patient');
module.exports.User = require('./user');
module.exports.Client = require('./client');
module.exports.Customer = require('./customer');