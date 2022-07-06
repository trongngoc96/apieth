require('dotenv').config();
var express = require('express');
var path = require('path');
var bodyParser = require('body-parser');
const sequelize = require('./configs/connect/database');

var routes = require('./configs/routes/api');

var app = express();

var cors = require('cors');
app.use(cors());


app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use('/api', routes);

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
    app.use(function(err, req, res, next) {
        res.status(err.status || 500);
        res.render('error', {
            message: err.message,
            error: err
        });
    });
}

app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
        message: err.message,
        error: {}
    });
});

sequelize
  .sync({force: false})
  .then(result => {
    app.listen(process.env.PORT);
    console.log(`Server now listening at localhost:${process.env.PORT}`);
  })
  .catch(err => {
    console.log(err);
  });

module.exports = app;
