var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var bodyParser = require('body-parser');
var session = require('express-session');
const dotenv = require('dotenv');

// load the environment variables
dotenv.load();

// create the instance of express
var app = express();

// Log requests to the console
app.use(logger(process.env.LOGTYPE || 'dev'));

// view engine setup
app.set('views', path.join(__dirname, 'server/views'));
app.set('view engine', 'pug');

// Parse incoming requests data (https://github.com/expressjs/body-parser)
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
    extended: false
}));

// add support for the cookie parser
app.use(cookieParser());

// add support for static files
app.use(express.static(path.join(__dirname, 'public')));

// Require our routes into the application
require('./server/routes/index')(app);
require('./server/routes/organization')(app);
require('./server/routes/person')(app);
require('./server/routes/project')(app);
require('./server/routes/kpi')(app);
require('./server/routes/auth')(app);
require('./server/routes/mindmap')(app);

app.get('*', (req, res) => res.status(200).send({
    message: 'Welcome to the beginning of nothingness.',
}));

// catch 404 and forward to error handler
app.use(function (req, res, next) {
    next(createError(404));
});

// error handler
app.use(function (err, req, res, next) {
    // set locals, only providing error in development
    res.locals.message = err.message;
    res.locals.error = req.app.get('env') === 'development' ? err : {};

    // render the error page
    res.status(err.status || 500);
    res.render('error');
});

module.exports = app;