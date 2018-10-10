var mongoose = require('mongoose');

var patientSchema = new mongoose.Schema({
    dni: {
        type: String,
        required: 'dni cannot be blank'
    },
    titular_dni: {
        type: String,
        required: false
    },
    full_name: {
        type: String,
        required: true
    },
    birth_date: {
        type: String,
        required: true
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
      required: false
    },
    insurance_code: {
      type: String,
      required: false
    },
    created_date: {
      type: Date,
      default: Date.now()
    },
    modified_date: {
      type: Date,
      default: Date.now()
    },
    status: {
        type: Boolean,
        required: false,
        default: true
    }
    
});

var Patient = mongoose.model('Patient', patientSchema);
module.exports = Patient;