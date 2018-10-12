'use strict';

let ErrorMessage = require('./error_message');

class ErrorDefine {
    constructor() {
        this.errorDefault = function (message) {
            return new ErrorMessage(9999, message);
        };

        this.errorException = function (exception) {
            return new ErrorMessage(9998, exception.message || exception, exception.stack || null);
        };

        this.errorNotFound              = new ErrorMessage(9997, 'Not found method');
        this.errorSqlQuery              = new ErrorMessage(9996, 'Some sql query error');
        this.mailerError                = new ErrorMessage(9995, 'Mailer error');
        this.mailerNotAvailable         = new ErrorMessage(9996, 'Mailer not available');
        this.somethingError             = new ErrorMessage(9994, 'Something error');

        //Authentication's errors: 20xx
        this.tokenFail                  = new ErrorMessage(2000, 'Failed to authenticate token');
        this.clientTokenRequired        = new ErrorMessage(2001, 'Client token is required');
        this.tokenInvalid               = new ErrorMessage(2002, 'Token is invalid');
        this.secretFail                 = new ErrorMessage(2003, 'secret is fail');
        this.facebookAppIdNotFound      = new ErrorMessage(2004, 'Facebook app Id is not found');
        this.tokenExternalRequired      = new ErrorMessage(2005, 'External token is required');
        this.providedNotMatch           = new ErrorMessage(2006, 'Provider not match');
        this.providerRequired           = new ErrorMessage(2007, 'Provider is required');
        this.userTokenRequired          = new ErrorMessage(2008, 'User token is required');
        this.tokenExpires               = new ErrorMessage(2009, 'Token is expires');
        this.tokenTooSmallTime          = new ErrorMessage(2010, 'Token too small time');

        this.gcmTokenRequired           = new ErrorMessage(2011, 'GCM token is required');
        this.gcmPlatformRequired        = new ErrorMessage(2012, 'GCM platform is required');

        //User's errors: 21xx
        this.userNotFound               = new ErrorMessage(2100, 'User not found');
        this.usernameRequired           = new ErrorMessage(2101, 'The username field is required');
        this.usernameLengthTooShort     = new ErrorMessage(2102, 'The username must be more than 6 character');
        this.usernameHasExisted         = new ErrorMessage(2103, 'The username has been already taken');

        this.passwordRequired           = new ErrorMessage(2104, 'The password field is required');
        this.oldPasswordRequired        = new ErrorMessage(2105, 'The old password field is required');
        this.newPasswordRequired        = new ErrorMessage(2106, 'The new password field is required');
        this.passwordWrong              = new ErrorMessage(2107, 'The password field is wrong');
        this.oldPasswordWrong           = new ErrorMessage(2108, 'The old password field is wrong');
        this.passwordLengthTooShort     = new ErrorMessage(2109, 'The password must be more than 6 character');
        this.newPasswordLengthTooShort  = new ErrorMessage(2110, 'The new password must be more than 6 character');

        this.emailRequired              = new ErrorMessage(2150, 'The email field is required');
        this.emailInvalid               = new ErrorMessage(2151, 'The email is invalid');
        this.emailHasExisted            = new ErrorMessage(2152, 'The email has been already taken');
        this.emailNotAllowChange        = new ErrorMessage(2153, 'The email is not allowed to change');
    }
}

module.exports = ErrorDefine;