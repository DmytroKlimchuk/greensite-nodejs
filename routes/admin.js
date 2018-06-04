var express = require('express');
var router = express.Router();

var multer = require('multer');

// dest - директория для сохранения файлов, загружаемых на сервер
var upload = multer({dest: __dirname + '/../public/uploads'});

// указать, что будет загружен один файл с именем image.
// имя файла может быть любым, но оно должно совпадать со значением атрибута name элемента формы input с типом file
// например, <input type="file" name="image" />
var type = upload.single('image');

const admin = 1;
const Auth = require('../controller/AuthController');
const Post = require('../controller/PostController');

/* GET home page. */
router.get('/', function(req, res) {
    Auth.checkUser(req,res,admin, Post.index);
});

router.get('/add', function(req, res) {
    Auth.checkUser(req,res,admin,function (req, res) {
        res.render('adminPostAdd', { Auth: req.session.userEmail });
    })
});

router.get('/edit', function(req, res) {
    Auth.checkUser(req,res,admin,Post.edit);
});

router.post('/add', type, function(req, res) {
    Auth.checkUser(req,res,admin, Post.add);
});

router.post('/edit', type, function(req, res) {
    Auth.checkUser(req,res,admin, Post.update);
});

router.get('/delete', function(req, res) {
    Auth.checkUser(req,res,admin, Post.delete);
});

router.get('/clear', function(req, res) {
    Auth.checkUser(req,res, 0, Post.clear);
});

module.exports = router;
