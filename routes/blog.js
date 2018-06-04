var express = require('express');
var router = express.Router();

const Blog = require('../controller/PostController');

/* GET home page. */
router.get('/', Blog.getPosts);

module.exports = router;
