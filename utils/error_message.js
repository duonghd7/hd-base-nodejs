'use strict';

class ErrorMessage {
    constructor(errorCode, errorMessage, stack) {
        this.errorCode = errorCode;
        this.errorMessage = errorMessage;
        this.stack = stack || null;
    }
}

module.exports = ErrorMessage;