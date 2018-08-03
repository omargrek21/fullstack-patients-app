var mongoose = require('mongoose');

const clientSchema = new mongoose.Schema({
    name: {
        type: String,
        required: 'name cannot be blank'
    },
    status: {
        type: Boolean,
        default: true,
        required: 'status cannot be blank'
    },
    created_date: {
        type: Date,
        default: Date.now()
    }
});

const Client = mongoose.model('Client', clientSchema);
module.exports = Client;