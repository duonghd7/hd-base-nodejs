'use strict';

let vsprintf = require('sprintf-js').vsprintf;
let crypto = require('crypto');
let base64url = require('base64url');

let error_define = require('../../utils/error_define');
let ErrorsDefine = new error_define();

let db = require('../../database/database');

class AuthService {

    static createToken(userId, callbackError, callbackSuccess){
        let token = base64url(base64url(crypto.randomBytes(32)));
        let queryInsert = vsprintf('INSERT INTO user_token (user_id, token) VALUES ("%s", "%s");', [userId, token]);
        db.query(queryInsert, (error) => {
            if (error) {
                callbackError();
            } else {
                callbackSuccess(token);
            }
        });
    }

    static updateToken(userId, callbackError, callbackSuccess){
        let queryUpdate = vsprintf('UPDATE user_token SET status = 0 WHERE user_id = "%s";', [userId]);
        db.query(queryUpdate, (error) => {
            if (error) {
                callbackError(ErrorsDefine.errorSqlQuery);
            } else {
                callbackSuccess();
            }
        });
    }

    static verifyToken(token, callbackError, callbackSuccess) {
        let querySelect = vsprintf('SELECT * FROM user_token WHERE token = "%s" LIMIT 1;', [token]);
        db.query(querySelect, (error, data) => {
            if (error) {
                callbackError(ErrorsDefine.errorSqlQuery);
            } else {
                callbackSuccess(data);
            }
        });
    }

    static getUserByUserName(username, callbackError, callbackSuccess) {
        let querySelect = vsprintf('SELECT * FROM user WHERE username = "%s" LIMIT 1;', [username]);
        db.query(querySelect, (error, data) => {
            if (error) {
                callbackError(ErrorsDefine.errorSqlQuery);
            } else {
                callbackSuccess(data);
            }
        });
    }

    static getUserById(userId, callbackError, callbackSuccess) {
        let querySelect = vsprintf('SELECT * FROM user WHERE id = "%s" LIMIT 1;', [userId]);
        db.query(querySelect, (error, data) => {
            if (error) {
                callbackError(ErrorsDefine.errorSqlQuery);
            } else {
                callbackSuccess(data);
            }
        });
    }

    static insertUsernameToUserTable(username, password, callbackError, callbackSuccess) {
        let queryInsert = vsprintf('INSERT INTO user (username, password) VALUES ("%s", "%s");', [username, password]);
        db.query(queryInsert, (error) => {
            if (error) {
                callbackError(ErrorsDefine.errorSqlQuery);
            } else {
                callbackSuccess();
            }
        });
    }

    static updateUserPassword(userId, password, callbackError, callbackSuccess){
        let queryUpdate = vsprintf('UPDATE user SET password = \'%s\' WHERE id = %s;', [password, userId]);
        db.query(queryUpdate, (error) => {
            if (error) {
                callbackError(ErrorsDefine.errorSqlQuery);
            } else {
                callbackSuccess();
            }
        });
    }
}

module.exports = AuthService;