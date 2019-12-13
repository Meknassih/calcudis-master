const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');

const guard = require('./middleware/guard');
const indexRouter = require('./routes/index');
const computeRouter = require('./routes/compute');

const app = express();


app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));


app.use('/', indexRouter);
// Middlewares to protect "/compute" route with JWT token
app.use(guard.tokenExists);
app.use(guard.tokenValid);

app.use('/compute', computeRouter);

module.exports = app;
