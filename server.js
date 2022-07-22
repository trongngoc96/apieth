require('dotenv').config();

var express = require('express');
var bodyParser = require('body-parser');
var helmet = require('helmet');
var morgan = require('morgan');
const sequelize = require('./configs/connect/database');
const users = require('./app/models/users')
const token = require('./app/models/tokens');
const history = require('./app/models/historys');
const latests = require('./app/models/latest')
const ethHistorys = require('./app/models/ethHistorys');

var app = express();
var cors = require('cors');
const kue = require("kue");
var winston = require('./logs/winston');
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(helmet())
app.use(morgan('combined', { "stream": winston.stream.write}));
// app.use(cronJob);

var routes = require('./configs/routes/api');

app.use('/api', routes);
//app.use("/kue-api/", kue.app);
app.use((error, req, res, next) => {
    var message;
    if (error.data) {
        message = error.data
    } else {
        message = error.message;
    }
    const status = error.statusCode || 500;  
    res.status(status).send({ message: message, statusCode: status });
});
/**
 * Get port from environment and store in Express.
 */

var port = normalizePort(process.env.PORT || '3000');
app.set('port', port);
/**
 * Create HTTP server.
 */

sequelize
    .sync({ force: false })
    .then(result => {
        app.listen(process.env.PORT);
        console.log(`Server now listening at localhost:${process.env.PORT}`);
    })
    .catch(err => {
        console.log(err);
    });

/**
 * Normalize a port into a number, string, or false.
 */

function normalizePort(val) {
    var port = parseInt(val, 10);

    if (isNaN(port)) {
        // named pipe
        return val;
    }

    if (port >= 0) {
        // port number
        return port;
    }

    return false;
}

/**
 * Event listener for HTTP server "error" event.
 */

function onError(error) {
    if (error.syscall !== 'listen') {
        throw error;
    }

    var bind = typeof port === 'string'
        ? 'Pipe ' + port
        : 'Port ' + port;

    // handle specific listen errors with friendly messages
    switch (error.code) {
        case 'EACCES':
            console.error(bind + ' requires elevated privileges');
            process.exit(1);
            break;
        case 'EADDRINUSE':
            console.error(bind + ' is already in use');
            process.exit(1);
            break;
        default:
            throw error;
    }
}

/**
 * Event listener for HTTP server "listening" event.
 */

function onListening() {
    var addr = app.address();
    var bind = typeof addr === 'string'
        ? 'pipe ' + addr
        : 'port ' + addr.port;
    debug('Listening on ' + bind);
}

module.exports = app;
