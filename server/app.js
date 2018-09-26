var babel = require("babel-core");
require('dotenv').config();
var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var cors = require('cors');

var indexRouter = require('./routes/index');
// var itemsRouter = require('./routes/items');

//For local use:
// const sequelize = new Sequelize(
// 	process.env.DB_NAME, process.env.DB_USER, process.env.DB_PASS, {
//  	dialect: 'postgres'
// });

// const postgresPromise = sequelize.authenticate()
// .then(() => {
// 	console.log("Connected to Postgres");
// })
// .catch((err) => {
// 	console.log('Unable to connect to database:');
//   	console.log(err);
// });

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use(cors());

app.use('/', indexRouter);
// app.use('/items', itemsRouter);

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
  res.status(err.status || 500).send(error);
  res.render('error');
});

module.exports = app;