const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const userSchema = new Schema({
    email : {
        type : String,
        required : true,
        trim: true,
        lowercase:true,
        unique: true
    },
    password : {
        type : String,
        required : true,
        trim: true
    },
    firstname : {
        type : String,
        required : true,
        trim: true
    },
    lastname : {
        type : String,
        required : true,
        trim: true
    },
    phone : {
        type : String
    },
    admin :{
        type : Number
    }
});

const User = mongoose.model('users', userSchema);

module.exports = User;