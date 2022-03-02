const AWSProvider = require('aws-sdk');

AWSProvider.config.update({
    region: process.env.REGION,
});

const ssmClient = new AWSProvider.SecretsManager({ apiVersion: 'latest' });
const credentialsBaseUrl = process.env.SSM_BASE_URL;

module.exports.getCredentials = async (credentialsKey) => {
    const params = {
        SecretId: credentialsBaseUrl + credentialsKey
    };

    console.log(JSON.stringify(params));

    //TODO Improve Error Handling
    return ssmClient.getSecretValue(params).promise()
        .then((res) => { return JSON.parse(res.SecretString); })
        .catch((err) => { throw err; });
};
