var mongoose = require('mongoose');

var customerSchema = new mongoose.Schema({
    dni: {
        type: String,
        required: 'dni cannot be blank'
    },
    full_name: {
        type: String,
        required: true
    },
    birth_date: {
        type: String,
        required: true
    },
    created_date: {
      type: Date,
      default: Date.now()
    },
    modified_date: {
      type: Date,
      default: Date.now()
    },
    device_phone: {
      type: String,
      required: false,
      unique: true
    },
    address: {
      type: String,
      required: false
    },
    patient_phone: {
      type: String,
      required: false
    },
    contact_phone_1: {
      type: String,
      required: false
    },
    contact_name_1: {
      type: String,
      required: false
    },
    relationship_1: {
      type: String,
      required: false
    },
    contact_phone_2: {
      type: String,
      required: false
    },
    contact_name_2: {
      type: String,
      required: false
    },
    relationship_2: {
      type: String,
      required: false
    },
    status: {
        type: Boolean,
        required: false,
        default: true
    }
});

let Customer = mongoose.model('Customer', customerSchema);
module.exports = Customer;