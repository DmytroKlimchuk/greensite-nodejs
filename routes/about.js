var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
    res.render('about', { Auth: req.session.userEmail });
});

module.exports = router;
