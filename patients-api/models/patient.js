var mongoose = require('mongoose');

var patientSchema = new mongoose.Schema({
    dni: {
        type: String,
        required: 'dni cannot be blank'
    },
    titular_dni: {
        type: String,
        required: 'titular dni cannot be blank'
    },
    full_name: {
        type: String,
        required: 'fullname cannot be blank'
    },
    birth_date: {
        type: String,
        required: false
    },
    location: {
        type: String,
        required: false
    },
    type: {
        type: String,
        required: false
    },
    owner: {
        type: String,
        required: false
    },
    branch: {
        type: String,
        required: false
    },
    insurance_company: {
        type: String,
        required: 'insurance_company cannot be blank'
    },
    created_date: {
        type: Date,
        default: Date.now()
    }
});

var Patient = mongoose.model('Patient', patientSchema);
module.exports = Patient;