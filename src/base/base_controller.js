'use strict';

let _ = require('lodash');

let HttpStatusCode = require('../../utils/http_status_code');
let ApiResponse = require('../../utils/api_response');
let Logger = require('../../utils/logger');
let error_define = require('../../utils/error_define');
let ErrorsDefine = new error_define();

function BaseController() {
    this.router = require('express').Router();

    this.asSuccess = function (req, res, next, data, status) {
        let apiResponse = new ApiResponse();
        if (!_.isObject(data)) {
            apiResponse.data = data;
        } else if (_.isArray(data)) {
            apiResponse.data = this.handleReturnArrayData(data);
        } else {
            apiResponse.data = this.handleReturnObjectData(data);
        }

        return res.status(status || HttpStatusCode.OK).json(apiResponse);
    };

    this.asError = function (req, res, next, error, status) {
        let apiErrorMessages = [error];
        return this.asErrorWithListError(req, res, next, apiErrorMessages, status || HttpStatusCode.BadRequest);
    };

    this.asErrorWithListError = function (req, res, next, apiErrorMessages, status) {
        let apiResponse = new ApiResponse(null, apiErrorMessages, req.body || null, req.originalUrl || '');
        Logger.error(apiResponse);
        return res.status(status || HttpStatusCode.BadRequest).json(apiResponse);
    };

    this.asErrorWithException = function (req, res, next, exception, status) {
        let apiErrorMessages = [ErrorsDefine.errorException(exception)];
        return this.asErrorWithListError(req, res, next, apiErrorMessages, status || HttpStatusCode.InternalServerError);
    };

    this.handleReturnObjectData = function (data) {
        let result;
        result = this.onHandleReturnData(data);
        return result;
    };

    this.handleReturnArrayData = function (data) {
        let result = [];
        _.forEach(data, (item) => {
            result.push(this.onHandleReturnData(item));
        });
        return result;
    };

    this.onHandleReturnData = function (data) {
        let result = _.omit(data, ['_id']);
        result.id = data.id;
        return result;
    }
}

module.exports = BaseController;