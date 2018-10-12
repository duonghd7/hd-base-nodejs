'use strict';

let express = require('express');
let bodyParser = require('body-parser');
let config = require('../config.json');

let StartupController = require('./controller/startup_controller');
let AuthController = require('./controller/auth_controller');

let app = express();
let svPort = process.env.PORT || config.port;

class Server {
    static start() {
        svConfig();
        svRouter();
        svHandleError();
        app.listen(svPort, function () {
            console.log('Express server listening on port ' + svPort);
        });
    }
}

let svConfig = function () {
    app.use('/swagger', express.static('swagger'));
    app.use('/', express.static('web'));
    app.use(bodyParser.urlencoded({extended: true}));
    app.use(bodyParser.json());
};

let svRouter = function () {
    app.use('/api', new StartupController().svRouter());
    app.use('/api', new AuthController().svRouter());
};

let svHandleError = function () {
    app.use(function (req, res, next) {
        let errorResponse = {
            errorCode: 9997,
            errorMessage: 'Not Found URL',
            status: 404
        };
        next(errorResponse);
    });

    app.use(function (error, req, res, next) {
        let errorResponse = {
            data: null,
            errors: [{
                errorCode: error.errorCode || 9999,
                errorMessage: error.errorMessage || error || 'Server can not handler this error. Please contact to admin!'
            }],
            requestBody: req.body || null,
            requestUrl: req.originalUrl || ''
        };
        res.status(error.status || 500).json(errorResponse);
    });
};

module.exports = Server;