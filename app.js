var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');

var indexRouter = require('./routes/index');
// var usersRouter = require('./routes/users');

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

// Disable Express generataor routes
app.use('/', indexRouter);
// app.use('/users', usersRouter);

app.get('/', function(req, res, next) {
	res.render('index');
})

//adding route for the new ejs files that has been created
app.get('/sign-up.ejs', function(req, res, next){
	res.render('sign-up');
})

app.get('/bvn-validation.ejs', function(req, res, next) {
	res.render('bvn-validation');
})

app.get('/make-payment.ejs', function(req, res, next) {
  res.render('make-payment');
})

// catch 404 and forward to error handler
app.use(function(req, res, next) {
	res.render('error');
  // next(createError(404));
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
