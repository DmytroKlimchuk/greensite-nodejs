const DB = require('../db');
const User = require('../model/user.model');

const ProfileController = {

    getUserInfo : (req, res) => {

        if (req.session.userEmail) {

            DB.connect();
            User.find({email : req.session.userEmail})
                .then(user => {
                    res.render('profile', {user : user[0], Admin: req.session.admin, Auth: req.session.userEmail });
                })
                .catch(e => console.log(e));

        } else {
            res.redirect('/login');
        }
    }

};

module.exports = ProfileController;