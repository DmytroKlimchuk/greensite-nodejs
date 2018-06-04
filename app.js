const createError = require('http-errors');
const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const bodyParser = require('body-parser');
var session = require('express-session');

const notfoundRouter = require('./routes/404');
const aboutRouter = require('./routes/about');
const blogRouter = require('./routes/blog');
const discountsRouter = require('./routes/discounts');
const howRouter = require('./routes/how');
const faqRouter = require('./routes/faq');
const indexRouter = require('./routes/index');
const loginRouter = require('./routes/login');
const orderRouter = require('./routes/order');
const postRouter = require('./routes/post');
const priceRouter = require('./routes/price');
const profileRouter = require('./routes/profile');
const registerRouter = require('./routes/register');
const samplesRouter = require('./routes/samples');
const testimonialsRouter = require('./routes/testimonials');
const logoutRouter = require('./routes/logout');
const adminRouter = require('./routes/admin');

const app = express();

var secretValue = 'hs7a68%^&T*(U)(UUGEE$%Uldv';
// Функция 'express-session' принимает конфигурационный объект
app.use(session({
    // если true, сохраняет сеанс в хранилище заново, даже если запрос не изменялся
    resave : false,
    // если установленно значение true, приложение сохраняет новые данные, даже если они не менялись
    saveUninitialized : false,
    // ключ используемый для подписания cookie файла (идентификатора сеанса)
    secret: secretValue
}));


// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use( bodyParser.json() );       // to support JSON-encoded bodies
app.use(bodyParser.urlencoded({     // to support URL-encoded bodies
    extended: true
}));

app.use('/404', notfoundRouter);
app.use('/about', aboutRouter);
app.use('/blog', blogRouter);
app.use('/discounts', discountsRouter);
app.use('/how', howRouter);
app.use('/faq', faqRouter);
app.use('/', indexRouter);
app.use('/login', loginRouter);
app.use('/order', orderRouter);
app.use('/post', postRouter);
app.use('/price', priceRouter);
app.use('/profile', profileRouter);
app.use('/register', registerRouter);
app.use('/samples', samplesRouter);
app.use('/testimonials', testimonialsRouter);
app.use('/logout', logoutRouter);
app.use('/admin', adminRouter);


// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
