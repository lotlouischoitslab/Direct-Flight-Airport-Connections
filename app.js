var createError = require('http-errors');
var express = require('express');
const session = require('express-session');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var mysql = require('mysql');

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
var loginRouter = require('./routes/login')
var aboutRouter = require('./routes/about');
var databaseRouter = require('./routes/database');
var statisticsRouter = require('./routes/statistics');

var app = express();
// var process = require('./.env');
// const { auth } = require('express-openid-connect');

// app.use(
//   auth({
//     issuerBaseURL: process.ISSUER_BASE_URL, 
//     baseURL: process.BASE_URL,
//     clientID: process.CLIENT_ID,
//     secret: process.SECRET,
//   })
// ); //Tried something like this, and it is able to access the env values, but it is saying something about "it needs a secret"

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(session({
	secret: 'secret',
	resave: true,
	saveUninitialized: true
}));

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
app.use('/users', usersRouter);
app.use('/database', databaseRouter);
app.use('/about',aboutRouter);
app.use('/login',loginRouter)
app.use('/statistics',statisticsRouter);

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




// Make sure to use YOUR OWN DATABASE WHEN TESTING!
var con = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "Risha1234$",
  database: "CS411DB"
});




// con.connect(function(err) {
//   if (err) throw err;
//   con.query("SELECT * FROM Airports", function (err, result, fields) {
//     if (err) throw err;
//     console.log(result);
//   });

// });

module.exports = app;
