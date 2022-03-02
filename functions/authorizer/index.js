const layersPath = '/opt/nodejs';

const {getAuth0Credentials, authorizeRequest} = require(`${
    process.env.LOCAL ? '../../layers/services' : layersPath
}/services`);

exports.Handler = async (event, context) => {
    let data;
    try {

        const auth0Credentials = await getAuth0Credentials('credentials');
        data = await authorizeRequest(event,auth0Credentials);
    }
    catch (err) {
        console.log(err);
        return context.fail('Unauthorized');
    }

    return data;
};
