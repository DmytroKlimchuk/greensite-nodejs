var express = require('express');
var router = express.Router();

const Post = require('../controller/PostController');

/* GET home page. */
router.get('/', Post.show);

module.exports = router;
