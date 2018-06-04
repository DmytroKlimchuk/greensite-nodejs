var express = require('express');
var router = express.Router();

const auth = require('../controller/AuthController');

/* GET home page. */
router.get('/', function(req, res, next) {
    if(req.session.userEmail) res.redirect('/profile');
    res.render('login', { Auth: req.session.userEmail });
});

router.post('/', auth.login);

module.exports = router;
