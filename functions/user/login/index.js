const layersPath = '/opt/nodejs';
const { responseFactory, errorFactory, log } = require(
    `${process.env.LOCAL ? '../../../layers/utils' : layersPath}/utils`);
const {getAuth0Credentials, loginUser, getAuth0Id} = require(`${
    process.env.LOCAL ? '../../../layers/services' : layersPath
}/services`);

module.exports.Handler = async (event) => {
    try {
        const parsedBody = JSON.parse(event.body);

        const auth0Credentials = await getAuth0Credentials('credentials');
        const auth0Response = await loginUser(parsedBody.email, parsedBody.password, auth0Credentials);

        const auth0Id = getAuth0Id(auth0Response.id_token);

        return responseFactory({
            auth0Id,
            tokens: auth0Response
        });
    } catch (error) {
        log.error(error);

        if(error.response && error.response.status === 403)
            return errorFactory('invalid-credentials');
        return errorFactory(error);
    }
}
