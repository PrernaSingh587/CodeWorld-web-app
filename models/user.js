const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const userSchema = new Schema ({
    name: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    email : {
        type: String,
        required: true
    },
    institution: {
        type: String,
        required: true
    },
    branch : {
        type: String,
        required: true
    },
    resetToken : String,
    resetTokenExpiration: String,
})

module.exports = mongoose.model('User', userSchema);