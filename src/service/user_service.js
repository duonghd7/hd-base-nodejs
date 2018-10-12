'use strict';

let _ = require('lodash');

class UserService {

    static getProfile(data) {
        return _.omit(data, ['password']);
    }

    static getProfileWidthToken(data, token) {
        let result = _.omit(data, ['password']);
        result.accessToken = token;
        return result;
    }

    static getIdProfile(data) {
        return _.pick(data, ['id']);
    }

    /*static createTokenFromEmail(email) {
        return jwt.sign({email: email}, config.secret, {expiresIn: Constants.CycleToken * 60});
    }*/
}

module.exports = UserService;