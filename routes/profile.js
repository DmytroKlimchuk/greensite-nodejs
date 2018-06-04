var express = require('express');
var router = express.Router();

const Profile = require('../controller/ProfileController');

/* GET page. */
router.get('/', Profile.getUserInfo);

module.exports = router;
