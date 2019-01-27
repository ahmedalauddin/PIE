var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var bodyParser = require('body-parser');
var passport = require('passport');
var session = require('express-session')
var env = require('dotenv').load();

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

// Log requests to the console
app.use(logger('dev'));

// Parse incoming requests data (https://github.com/expressjs/body-parser)
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
  extended: false
}));

// Require our routes into the application
require('./server/routes/index')(app);
require('./server/routes/organization')(app);
require('./server/routes/person')(app);
require('./server/routes/project')(app);
require('./server/routes/kpi')(app);
require('./server/routes/auth')(app);
require('./server/routes/mindmap')(app);
var models = require('./server/models');

app.get('*', (req, res) => res.status(200).send({
  message: 'Welcome to the beginning of nothingness.',
}));

app.use(express.json());
app.use(express.urlencoded({
  extended: false
}));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

// For Passport
app.use(session({
  secret: 'quid-pro-quo',
  resave: true,
  saveUninitialized: true
})); // session secret
app.use(passport.initialize());
app.use(passport.session()); // persistent login sessions

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404));
});

//load passport strategies
require('./server/config/passport/passport.js')(passport, models.person);

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