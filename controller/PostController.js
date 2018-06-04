const DB = require('../db');
const Post = require('../model/post.model');
const User = require('../model/user.model');
var path = require('path');
var fs = require('fs');


const PostController = {
    errors : [],
    success : '',

    loadImage : (file, filename) => {
        // загруженный файл доступен через свойство req.file


        // файл временного хранения данных
        var tmp_path = file.path;

        // место, куда файл будет загружен
        var target_path = path.join(file.destination, filename);

        // загрузка файла
        var src = fs.createReadStream(tmp_path);
        var dest = fs.createWriteStream(target_path);

        src.pipe(dest);

        // обработка результатов загрузки
        src.on('end', function() {
            // удалить файл временного хранения данных
            fs.unlink(tmp_path);
        });

        src.on('error', function(err) {
            // удалить файл временного хранения данных
            fs.unlink(tmp_path);
        });
    },

    index : (req, res) => {
        res.render('admin', { Auth: req.session.userEmail });
    },

    getPosts  : function(req, res) {
        DB.connect();
        Post.find({})
            .then(posts => {
                console.log(posts);

                res.render('blog', { Auth: req.session.userEmail, Admin : req.session.admin,  posts : posts});
            })
            .catch(e => console.log(e));
    },

    show : (req, res) => {
        const postID = req.query.id;
        DB.connect();

        Post.find({_id : postID})
            .then(item => {
                console.log(item);
                res.render('post', { Auth: req.session.userEmail, posts : item });
            })
            .catch(e => console.log(e));
    },

    edit : (req, res) => {
        const postID = req.query.id;
        DB.connect();

        Post.find({_id : postID})
            .then(item => {
                console.log(item);
                res.render('adminPostEdit', { Auth: req.session.userEmail, post : item[0] });
            })
            .catch(e => console.log(e));
    },

    update : (req, res) => {
        PostController.errors = [];
        PostController.success = '';

        const postID = req.body.id;

        for(let key in req.body) {
            if(req.body[key] == '' && key != 'send' ) PostController.errors.push(`Незаповнене поле ${key}`);
        }

        if (!req.file) PostController.errors.push(`Необхідно вибрати картинку`);

        if (PostController.errors.length == 0) {

            const filename = Date.now() + '-' + req.file.originalname;

            PostController.loadImage(req.file, filename);

            console.log(req.session.userEmail);

            DB.connect();

            User.find({email : req.session.userEmail})
                .then(user => {

                    const data = {
                        author : user[0].firstname + ' ' + user[0].firstname,
                        date : Date.now(),
                        title : req.body.title,
                        image : filename,
                        description : req.body.description,
                        views : 0
                    };

                    Post.update({_id : postID}, data, {new: true})
                        .then(item => {
                            console.log('updated');
                            PostController.success = 'Пост успішно оновлений';
                            res.render('adminPostEdit', { title: 'Express', errors : PostController.errors, success : PostController.success});

                        })
                        .catch(e => console.log(e));


                })
                .catch(e => console.log(e));

        } else {
            const post = {
                _id : postID,
                author : req.body.author ? req.body.author : '' ,
                date : Date.now(),
                title : req.body.title ? req.body.title : '' ,
                image : '',
                description : req.body.description ? req.body.description : '' ,
                views : 0
            };
            res.render('adminPostEdit', { title: 'Express', post : post, errors : PostController.errors, success : PostController.success});
        }

    },

    add : (req, res) => {
        PostController.errors = [];
        PostController.success = '';

        for(let key in req.body) {
            if(req.body[key] == '' && key != 'send' ) PostController.errors.push(`Незаповнене поле ${key}`);
        }

        if (!req.file) PostController.errors.push(`Необхідно вибрати картинку`);

        if (PostController.errors.length == 0) {

            const filename = Date.now() + '-' + req.file.originalname;

            PostController.loadImage(req.file, filename);

            console.log(req.session.userEmail);

            DB.connect();

            User.find({email : req.session.userEmail})
                .then(user => {

                    const data = {
                        author : user[0].firstname + ' ' + user[0].firstname,
                        date : Date.now(),
                        title : req.body.title,
                        image : filename,
                        description : req.body.description,
                        views : 0
                    };

                    const post = new Post(data);

                    post.save()
                        .then((item)=>{
                            console.log(item);
                            PostController.success = 'Пост успішно доданий';
                            res.render('adminPostAdd', { title: 'Express', errors : PostController.errors, success : PostController.success});
                        })
                        .catch(e => console.log(e));

                })
                .catch(e => console.log(e));

        } else {
            res.render('adminPostAdd', { title: 'Express', errors : PostController.errors, success : PostController.success});
        }

    },

    delete : (req, res) => {
        const id = req.query.id;
        PostController.errors = [];
        PostController.success = '';

        if (!id) {
            PostController.errors.push('Некоректний запит.');

            res.render('adminPostDelete', {
                title: 'Express',
                errors: PostController.errors,
                success: PostController.success
            });
        } else {
            DB.connect();

            Post.find({_id : id})
                .then(() =>{
                    Post.find({_id : id}).remove()
                        .then(() => {
                            PostController.success = 'Пост успішно видалений';

                            res.render('adminPostDelete', {
                                title: 'Express',
                                errors: PostController.errors,
                                success: PostController.success
                            });
                        })
                        .catch(e => console.log(e));
                })
                .catch(e => {
                    console.log(e)

                    PostController.success = 'Некоректний запит';

                    res.render('adminPostDelete', {
                        title: 'Express',
                        errors: PostController.errors,
                        success: PostController.success
                    });

                });
        }

    },

    clear : (req, res) => {
        DB.connect();

        User.find({})
            .then(users => {
                User.find().remove()
                    .then(()=> console.log('All users was deleted'))
                    .catch(e => console.log(e))
            })
            .catch(e => console.log(e));

        Post.find({})
            .then(posts => {
                Post.find().remove()
                    .then(()=> console.log('All posts was deleted'))
                    .catch(e => console.log(e))
            })
            .catch(e => console.log(e));

        res.redirect('/register');
    }

};

module.exports = PostController;