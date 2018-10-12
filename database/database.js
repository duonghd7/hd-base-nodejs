'use strict';

let mysql = require('mysql');

let config = require('../config.json');

module.exports = mysql.createPool(config.database_connection);
