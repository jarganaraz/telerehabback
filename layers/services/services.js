const auth0Service = require('./auth0');
const ssmService = require('./ssm');

const authorizeRequest = (events,credentials,bypass = false) => {
    return auth0Service.authenticate(events,credentials,bypass);
}

const getAuth0Credentials = async (param = 'credentials') => {
    return ssmService.getCredentials(`auth0/${param}`)
}

const getManagementToken = async (credentials) => {
    return await auth0Service.requestToken(credentials);
}

const loginUser = async (username,password,credentials) => {
    return await auth0Service.loginUser(username,password,credentials);
}

const registerUser = async (email,name,password,credentials) => {
    return await auth0Service.registerUser(email,name,password,credentials);
}

const changePasswordEmail = async (email,credentials) => {
    return await auth0Service.changePasswordEmail(email,credentials);
}

const getAuth0Id = (idToken) => {
    return auth0Service.decodeToken(idToken);
}

module.exports = {
    getAuth0Credentials,
    authorizeRequest,
    getManagementToken,
    loginUser,
    registerUser,
    changePasswordEmail,
    getAuth0Id
}
