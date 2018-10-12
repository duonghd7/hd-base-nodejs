'use strict';

class ApiResponse {
    constructor(data, errors, requestBody, requestUrl) {
        this.data = data || null;
        this.errors = errors || null;
        this.requestBody = requestBody || null;
        this.requestUrl = requestUrl || null;
    }
}

module.exports = ApiResponse;