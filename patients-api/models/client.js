const mongoose = require('mongoose');

const clientSchema = new mongoose.Schema({
    name: {
        type: String,
        required: 'insurance name cannot be blank'
    },
    status: {
        type: Boolean,
        default: true
    },
    branch:{
        type: String,
        required: false
    },
    insurance_code: {
        type: String,
        required: 'Insurance code cannot be blank'
    },
    qty:{
        type: Number,
        required:true
    },
    modified_date: {
        type: Date,
        default: Date.now()
    },
    created_date: {
        type: Date,
        default: Date.now()
    }
});

const Client = mongoose.model('Client', clientSchema);
module.exports = Client;