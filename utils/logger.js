'use strict';

class Logger {
    static info(info) {
        console.info(info);
    }

    static error(error) {
        console.error(error);
    }
}

module.exports = Logger;