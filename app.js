var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var session = require('client-sessions');


var index = require('./routes/index');
var users = require('./routes/users');
var list = require('./routes/list');
var my_boards = require('./routes/my_boards');

var boards = require('./routes/boards');
var login = require('./routes/login');
var register = require('./routes/register');
var board = require('./routes/board');
var logout = require('./routes/logout');
//part of final test
var forgot_password = require('./routes/forgotpassword');
var passwordreset = require('./routes/passwordreset');

var User = require('./models/user');

var mongoose = require('mongoose');
mongoose.connect('mongodb://localhost/prello');

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

//session setup
app.use(session({
  cookieName: 'session',
  secret: 'secret-string',
  duration: 30 * 60 * 1000,
  activeDuration: 5 * 60 * 1000,
  httpOnly: true,
  secure: true,
  ephemeral: true
}));

app.use(function(req, res, next) {
  if (req.session && req.session.user) {
    User.findOne({ email: req.session.user.email }, function(err, user) {
      if (user) {
        req.user = user;
        delete req.user.password; // delete the password from the session
        req.session.user = user;  //refresh the session value
        res.locals.user = user;
      }
      // finishing processing the middleware and run the route
      next();
    });
  } else {
    next();
  }
});


app.use('/', index);
app.use('/users', users);
app.use('/list', list );
app.use('/my_boards', my_boards );

app.use('/login', login );
app.use('/boards', boards);
app.use('/register', register);
app.use('/board', board);
app.use('/logout', logout);
//final test
app.use('/forgotpassword', forgot_password);
app.use('/passwordreset', passwordreset);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
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
