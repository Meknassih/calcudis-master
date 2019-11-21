const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');

const guard = require('./middleware/guard');
const indexRouter = require('./routes/index');
const usersRouter = require('./routes/users');

const app = express();

// My middlewares
app.use(guard.tokenExists);

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));


app.use('/', indexRouter);
app.use('/users', usersRouter);

module.exports = app;
