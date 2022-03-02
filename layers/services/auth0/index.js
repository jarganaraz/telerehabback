const jwksClient = require('jwks-rsa');
const jwt = require('jsonwebtoken');
const jwtDecode = require('jwt-decode');
const util = require('util');
const axios = require('axios');

const getPolicyDocument = (effect, resource) => {
    const policyDocument = {
        Version: '2012-10-17', // default version
        Statement: [{
            Action: 'execute-api:Invoke', // default action
            Effect: effect,
            Resource: '*',
        }]
    };
    return policyDocument;
}


// extract and return the Bearer Token from the Lambda event parameters
const getToken = (params) => {
    if (!params.type || params.type !== 'TOKEN') {
        throw new Error('Expected "event.type" parameter to have value "TOKEN"');
    }

    const tokenString = params.authorizationToken;
    if (!tokenString) {
        throw new Error('Expected "event.authorizationToken" parameter to be set');
    }

    const match = tokenString.match(/^Bearer (.*)$/);
    if (!match || match.length < 2) {
        throw new Error(`Invalid Authorization token - ${tokenString} does not match "Bearer .*"`);
    }
    return match[1];
}

module.exports.authenticate = (params,credentials, bypass = false) => {

    if(bypass){
        return {
            principalId: 'bypassed',
            policyDocument: getPolicyDocument('Allow', params.methodArn),
            context: { scope: 'bypassed' }
        }
    }

    const issuer = `https://${credentials.domain}/`;
    const jwksUri = `${issuer}.well-known/jwks.json`;
    const audience = `${credentials.audience}`;

    const jwtOptions = {
        audience,
        issuer
    };

    console.log(params);
    const token = getToken(params);

    const decoded = jwt.decode(token, { complete: true });
    if (!decoded || !decoded.header || !decoded.header.kid) {
        throw new Error('invalid token');
    }

    const client = jwksClient({
        cache: true,
        rateLimit: true,
        jwksRequestsPerMinute: 10, // Default value
        jwksUri
    });

    const getSigningKey = util.promisify(client.getSigningKey);
    return getSigningKey(decoded.header.kid)
        .then((key) => {
            const signingKey = key.publicKey || key.rsaPublicKey;
            console.log("issuer is", issuer);
            return jwt.verify(token, signingKey, jwtOptions);
        })
        .then((decoded)=> ({
            principalId: decoded.sub,
            policyDocument: getPolicyDocument('Allow', params.methodArn),
            context: { scope: decoded.scope }
        }));
}

module.exports.requestToken = async (credentials) => {
    const options = {
        grant_type: 'client_credentials',
        client_id: `${credentials.client_id}`,
        client_secret: `${credentials.client_secret}`,
        audience: `${credentials.audience}`
    }
    const auth0Response = await axios.post(`https://${credentials.domain}/oauth/token`, options)
        .catch( err => {
        throw err
    })
    return auth0Response.data;
}

module.exports.loginUser = async (username,password,credentials) => {
    const options = {
        grant_type: 'password',
        client_id: `${credentials.client_id}`,
        client_secret: `${credentials.client_secret}`,
        audience: `${credentials.audience}`,
        connection: `${credentials.connection}`,
        username,
        password,
        scope: "openid email profile offline_access"
    }
    const auth0Response = await axios.post(`https://${credentials.domain}/oauth/token`, options)
        .catch( err => {
        throw err
    })
    return auth0Response.data;
}

module.exports.registerUser = async (email,name,password,credentials) => {
    const options = {
        client_id: `${credentials.client_id}`,
        connection: `${credentials.connection}`,
        email,
        name,
        password
    }
    const auth0Response = await axios.post(`https://${credentials.domain}/dbconnections/signup`, options)
        .catch( err => {
        throw err
    })
    return auth0Response.data;
}

module.exports.changePasswordEmail = async (email,credentials) => {
    const options = {
        client_id: `${credentials.client_id}`,
        connection: `${credentials.connection}`,
        email
    }
    const auth0Response = await axios.post(`https://${credentials.domain}/dbconnections/change_password`, options)
        .catch( err => {
        throw err
    })
    return auth0Response.data;
}

module.exports.decodeToken = (idToken) => {
    console.log(idToken);
    const decoded = jwtDecode(idToken);
    console.log(decoded);
    return decoded.sub;
}
