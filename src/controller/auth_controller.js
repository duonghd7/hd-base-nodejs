'use strict';

let base64 = require('base-64');
let pwHash = require('password-hash');

let BaseController = require('../base/base_controller');
let AuthService = require('../service/auth_service');
let UserService = require('../service/user_service');
let HttpStatusCode = require('../../utils/http_status_code');
let error_define = require('../../utils/error_define');
let ErrorsDefine = new error_define();

function AuthController() {
    let _ = this;
    this.svRouter = function () {
        _.router.post('/auth/sign-up', svAuthSignUp);
        _.router.post('/auth/sign-in', svAuthSignIn);
        _.router.use('/auth', svAuthToken);
        _.router.post('/auth/me', svAuthMe);
        _.router.post('/auth/change-password', svAuthChangePassword);
        _.router.post('/auth/sign-out', svAuthSignOut);
        return _.router;
    };

    let svAuthSignUp = function (req, res, next) {
        try {
            let username = req.body['username'];
            let password = req.body['password'];

            if (username === undefined || username.length === 0) {
                return _.asError(req, res, next, ErrorsDefine.usernameRequired);
            } else if (username.length < 6) {
                return _.asError(req, res, next, ErrorsDefine.usernameLengthTooShort);
            } else if (password === undefined || password.length === 0) {
                return _.asError(req, res, next, ErrorsDefine.passwordRequired);
            } else if (password.length < 6) {
                return _.asError(req, res, next, ErrorsDefine.passwordLengthTooShort);
            } else {
                AuthService.getUserByUserName(username,
                    (error) => {
                        return _.asError(req, res, next, error);
                    },
                    (data) => {
                        if (data.length !== 0) {
                            return _.asError(req, res, next, ErrorsDefine.usernameHasExisted);
                        } else {
                            AuthService.insertUsernameToUserTable(username, pwHash.generate(base64.encode(password)),
                                (error) => {
                                    return _.asError(req, res, next, error);
                                },
                                () => {
                                    AuthService.getUserByUserName(username,
                                        (error) => {
                                            return _.asError(req, res, next, error);
                                        },
                                        (data) => {
                                            createToken(data[0], req, res, next);
                                        });
                                });
                        }
                    });
            }
        } catch (exception) {
            return _.asErrorWithException(req, res, next, exception);
        }
    };

    let svAuthSignIn = function (req, res, next) {
        try {
            let username = req.body['username'];
            let password = req.body['password'];

            if (username === undefined || username.length === 0) {
                return _.asError(req, res, next, ErrorsDefine.usernameRequired);
            } else if (password === undefined || password.length === 0) {
                return _.asError(req, res, next, ErrorsDefine.passwordRequired);
            } else {
                AuthService.getUserByUserName(username,
                    (error) => {
                        return _.asError(req, res, next, error);
                    },
                    (data) => {
                        if (data.length === 0) {
                            return _.asError(req, res, next, ErrorsDefine.userNotFound);
                        } else if (!pwHash.verify(base64.encode(password), data[0]['password'])) {
                            return _.asError(req, res, next, ErrorsDefine.passwordWrong);
                        } else {
                            AuthService.updateToken(data[0]['id'],
                                (error) => {
                                    return _.asError(req, res, next, error);
                                },
                                () => {
                                    createToken(data[0], req, res, next);
                                });
                        }
                    });
            }
        } catch (exception) {
            return _.asErrorWithException(req, res, next, exception);
        }
    };

    let createToken = function (data, req, res, next) {
        try {
            AuthService.createToken(data['id'],
                () => {
                    createToken(data, req, res, next);
                },
                (token) => {
                    return _.asSuccess(req, res, next, UserService.getProfileWidthToken(data, token));
                });
        }
        catch (exception) {
            return _.asErrorWithException(req, res, next, exception);
        }
    };

    let svAuthToken = function (req, res, next) {
        try {
            let token = req.headers['access-token'];
            if (token === undefined || token.length === 0) {
                return _.asError(req, res, next, ErrorsDefine.tokenExternalRequired);
            } else {
                AuthService.verifyToken(token,
                    (error) => {
                        return _.asError(req, res, next, error);
                    },
                    (data) => {
                        if (data.length === 0) {
                            return _.asError(req, res, next, ErrorsDefine.tokenInvalid);
                        } else if (data[0]['status'] === 0) {
                            return _.asError(req, res, next, ErrorsDefine.tokenExpires);
                        } else {
                            req.headers['token_userId'] = data[0]['user_id'];
                            next();
                        }
                    });
            }
        } catch (exception) {
            _.asErrorWithException(req, res, next, exception);
        }
    };

    let svAuthMe = function (req, res, next) {
        try {
            let userId = req.headers['token_userId'];
            if (userId === undefined || userId.length === 0) {
                return _.asError(req, res, next, ErrorsDefine.somethingError, HttpStatusCode.InternalServerError);
            } else {
                AuthService.getUserById(userId,
                    (error) => {
                        return _.asError(req, res, next, error);
                    },
                    (data) => {
                        if (data.length === 0) {
                            return this.asError(req, res, next, ErrorsDefine.tokenInvalid);
                        } else {
                            return _.asSuccess(req, res, next, UserService.getProfile(data[0]));
                        }
                    });
            }
        } catch (exception) {
            _.asErrorWithException(req, res, next, exception);
        }
    };

    let svAuthChangePassword = function (req, res, next) {
        try {
            let userId = req.headers['token_userId'];
            let old_password = req.body['old_password'];
            let new_password = req.body['new_password'];

            if (userId === undefined || userId.length === 0) {
                return _.asError(req, res, next, ErrorsDefine.somethingError, HttpStatusCode.InternalServerError);
            } else if (old_password === undefined || old_password.length === 0) {
                return _.asError(req, res, next, ErrorsDefine.oldPasswordRequired);
            } else if (new_password === undefined || new_password.length === 0) {
                return _.asError(req, res, next, ErrorsDefine.newPasswordRequired);
            } else if (new_password.length < 6) {
                return _.asError(req, res, next, ErrorsDefine.newPasswordLengthTooShort);
            } else {
                AuthService.getUserById(userId,
                    (error) => {
                        return _.asError(req, res, next, error);
                    },
                    (data) => {
                        if (data.length === 0) {
                            return this.asError(req, res, next, ErrorsDefine.tokenInvalid);
                        } else if (!pwHash.verify(base64.encode(old_password), data[0]['password'])) {
                            return _.asError(req, res, next, ErrorsDefine.oldPasswordWrong);
                        } else {
                            AuthService.updateUserPassword(userId, pwHash.generate(base64.encode(new_password)),
                                (error) => {
                                    return _.asError(req, res, next, error);
                                },
                                () => {
                                    AuthService.getUserById(userId,
                                        (error) => {
                                            return _.asError(req, res, next, error);
                                        },
                                        (data) => {
                                            return _.asSuccess(req, res, next, UserService.getProfile(data[0]));
                                        });
                                });
                        }
                    });
            }
        } catch (exception) {
            return _.asErrorWithException(req, res, next, exception);
        }
    };

    let svAuthSignOut = function (req, res, next) {
        try {
            let userId = req.headers['token_userId'];
            if (userId === undefined || userId.length === 0) {
                return _.asError(req, res, next, ErrorsDefine.somethingError, HttpStatusCode.InternalServerError);
            } else {
                AuthService.updateToken(userId,
                    (error) => {
                        return _.asError(req, res, next, error);
                    },
                    () => {
                        return _.asSuccess(req, res, next, "Sign-out success!");
                    });
            }
        } catch (exception) {
            _.asErrorWithException(req, res, next, exception);
        }
    };
}

AuthController.prototype = new BaseController();
module.exports = AuthController;