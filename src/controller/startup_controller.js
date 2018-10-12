'use strict';

let moment = require('moment');
let BaseController = require('../base/base_controller');
let db = require('../../database/database');

function StartupController() {
    let _ = this;
    this.svRouter = function () {
        _.router.get('', svPing);
        _.router.get('/database', svDatabase);
        return _.router;
    };

    let svPing = function (req, res, next) {
        return _.asSuccess(req, res, next, moment.utc().format("YYYY-MM-DDTHH:mm:ssZZ"));
    };

    let svDatabase = function (req, res, next) {
        db.query('SELECT 1', (error) => {
            if (error) {
                return _.asError(req, res, next, error);
            } else {
                return _.asSuccess(req, res, next, "Database connected!");
            }
        });
    };
}

StartupController.prototype = new BaseController();
module.exports = StartupController;