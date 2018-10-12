var domain = location.protocol + "//" + location.host;

var configDebug = {

    token: {
        active: true
    },

    usernamePassword: {
        active: true,
        url: domain + "/api/login"
    },

    externalLogin: {
        active: true,
        url: domain + "/api/registerOrLoginExternal",
        options: [
            {
                name: "facebook",
                providerName: "facebook"
            }
        ]
    },

    loginSocial: {
        active: true,
        facebookAppId: "401253430241352"
    }
};

function getConfig() {
    return configDebug;
};

var config = getConfig();