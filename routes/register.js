const express = require('express');
const router = express.Router();

const auth = require('../controller/AuthController');

/* GET page. */
router.get('/', function(req, res) {
    if(req.session.userEmail) res.redirect('/profile');
    res.render('register', { Auth: req.session.userEmail });
});

router.post('/', auth.register);

module.exports = router;
