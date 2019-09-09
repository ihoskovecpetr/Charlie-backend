var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
//const MongoClient = require('mongodb').MongoClient;
var mongoose = require('mongoose');


var SettingsObj = require('./settings.js');


//Mongoose DB connection (being exported to routes down there)
mongoose.connect(SettingsObj.url, { useNewUrlParser: true });
mongoose.set('debug', true);
// MongoClient.connect(SettingsObj.url,{ useNewUrlParser: true }, function(err, db) {
//   if (err) throw err;
//   console.log("Database connected! Tyler Charlie");
//   db.close();});
const POI = new mongoose.Schema(SettingsObj.MongoRastr);
POI.index({ geometry: "2dsphere" });
const PartyCollection = mongoose.model('Party-collection', POI)
module.exports = { PartyCollection };  //MUST BE HERE before require indexRouter coz has to be available before it runs index.js

var indexRouter = require ('./index');
var mailRouter = require('./mail');
var apiRouter = require('./api');

var app = express();

// view engine setup
const ExpHbs = require('express-handlebars')
app.engine('handlebars', ExpHbs());
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'handlebars');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());

app.use('/api2', apiRouter);
app.use('/mail', mailRouter);
app.use('/', indexRouter);

app.use(express.static(path.join(__dirname, 'public')));
app.use(express.static(path.join(__dirname, 'public/client/dist')));


const PORT = process.env.PORT || 3003
app.listen(PORT, () => { console.log(`Mixing it up on port ${PORT}`) })

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
  res.send('error z app.ks')
  console.log("ERRORRRR: ", {err})
});


