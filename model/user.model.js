const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const userSchema = new Schema({
    email : {
        type : String,
        required : true
    },
    password : {
        type : String,
        required : true
    },
    firstname : {
        type : String,
        required : true
    },
    lasttname : {
        type : String,
        required : true
    },
    phone : {
        type : String
    }
});

const User = mongoose.model('users', userSchema);

module.exports = User;