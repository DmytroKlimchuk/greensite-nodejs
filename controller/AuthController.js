const DB = require('../db');
const User = require('../model/user.model');
const bcrypt = require('bcrypt');

const AuthController = {
    errors : [],
    success : '',

    checkUser : (req, res, admin = 0, callback) => {
        if(req.session.admin != admin) {
            res.render('login', {errors : ['У вас нема доступу до цієї сторінки']});
        } else if(!req.session.userEmail) {
            res.render('login', {errors : ['Сторінка доступна лише для авторизованих користувачів']});
        }else {
            callback(req, res);
        }
    },

    hashPassword : (value) => {
        let salt = bcrypt.genSaltSync(10);
        let password = bcrypt.hashSync(value, salt);
        return password;
    },

    validate : (user) => {

        //Перевірка на пусті значення
        for(let key in user) {
            if(user[key] == '' && key != 'send' ) AuthController.errors.push(`Незаповнене поле ${key}`);
        }

        // Перевірка на одинакові паролі
        if(user.password && user.password2 && user.password != user.password2) AuthController.errors.push(`Паролі не співпадають`);

        // Перевірка довжини пароля
        if(user.password.length < 1) AuthController.errors.push(`Мінімальна довжина пароля - 1 символів`);

        if (AuthController.errors.length > 0) return false;

        return true;
    },

    addUser : (data, callback) => {
        const user = new User(data);

        user.save()
            .then(() => {
                console.log('User created');
                AuthController.success = 'Користувача успішно зареєстровано. Для входу на сайт використайте ваш email та пароль';

                User.find({})
                    .then(users => console.log(users))
                    .catch(e => console.log(e));


                callback();

            })
            .catch(e => {
                console.log(e);
                AuthController.errors.push('Помилка створення користувача');

            });
    },

    register : (req, res) => {
        AuthController.success = '';
        AuthController.errors = [];

        //Перевіряємо на коректність введені дані
        if (AuthController.validate(req.body)) {
            console.log('Validate passed');

            DB.connect();
            //Перевіряємо існування користувача в базі з вказаним email
            User.find({email : req.body.email})
                .then(item => {

                    if(item.length) {
                        AuthController.errors.push('Користувач з таким email вже існує');
                        console.log(`User exist`);
                        res.render('register', { title: 'Express', errors : AuthController.errors, success : AuthController.success});

                    }else if (AuthController.errors.length == 0) {
                        console.log('Email passed');

                        //Приступаємо до реєстрації
                        const user = {
                            email : req.body.email,
                            password : AuthController.hashPassword(req.body.password),
                            firstname : req.body.firstname,
                            lastname : req.body.lastname,
                            phone : req.body.phone,
                            admin : 0
                        };

                        User.find({})
                            .then(items => {
                                user.admin = items.length == 0 ? 1 : 0;

                                console.log('user.admin ' + user.admin);

                                AuthController.addUser(user, function () {
                                    res.render('register', { title: 'Express', errors : AuthController.errors, success : AuthController.success});
                                });
                            })
                            .catch(e => console.log(e));

                    }

                })
                .catch(e => {
                    console.log(e);
                });

        } else {
            console.log(AuthController.errors);
            res.render('register', { title: 'Express', errors : AuthController.errors, success : AuthController.success});
        }

        User.find({})
            .then(users => console.log(users))
            .catch(e => console.log(e));
    },

    login : (req, res) => {
        AuthController.success = '';
        AuthController.errors = [];

        const user = {
            email : req.body.email,
            password: req.body.password
        };

        console.log(user);

        for(let key in req.body) {
            if(req.body[key] == '' && key != 'send' ) AuthController.errors.push(`Незаповнене поле ${key}`);
        }

        if (AuthController.errors.length == 0) {

            DB.connect();
            User.find({email : user.email})
                .then(item => {

                    if(!item.length || bcrypt.compareSync(user.password, item[0].password) === false) {
                        AuthController.errors.push('Вказаного користувача не існує, або введені логін та пароль не співпадають');
                        res.render('login', { title: 'Express', errors : AuthController.errors, success : AuthController.success});
                    } else {
                        AuthController.success = 'Авторизація пройшла успішно';

                        if(!req.session.flag){
                            console.log('Set Session');
                            // Записываем данные в сессию
                            req.session.userEmail = user.email;
                            req.session.admin = item[0].admin;
                            req.session.flag = true;
                        }
                    }

                    res.redirect('/profile');

                })
                .catch(e => console.log(e));
        } else {
            res.render('login', { title: 'Express', errors : AuthController.errors, success : AuthController.success});
        }


    }

};

module.exports = {
    register : AuthController.register,
    login : AuthController.login,
    checkUser : AuthController.checkUser
};