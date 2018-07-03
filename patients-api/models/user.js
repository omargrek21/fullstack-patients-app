var mongoose = require('mongoose');

var userSchema = new mongoose.Schema({
    username: {
        type: String,
        required: 'username cannot be blank',
        trim: true,
        unique: true
    },
    password: {
        type: String,
        required: 'titular dni cannot be blank'
    },
    created_date: {
        type: Date,
        default: Date.now()
    }
});

var User = mongoose.model('User', userSchema);
module.exports = User;