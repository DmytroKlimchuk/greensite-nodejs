const DB = require('mongoose');

const DB = {
    connect : function () {
        mongoose.connect('mongoDB://localhost/greensite')
            .then(console.log('Connected to DB'))
            .catch(e => console.log(e));
    }
};

module.exports = {
    connect : DB.connect
};