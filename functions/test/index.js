const layersPath = '/opt/nodejs';
const { responseFactory } = require(
    `${process.env.LOCAL ? '../../../layers/utils' : layersPath}/utils`);

module.exports.Handler = async (event) => {
    return responseFactory({});
}
