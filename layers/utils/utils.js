const lodash = require('lodash');
const Dictionary = require('./dictionaries/dictionaryService');
const dictionaryError = getDictionary('error');
const log = require('lambda-log');
const ExcelJS = require('exceljs');
function responseFactory(data, status = null) {
  const response = {
    statusCode: status ? status : lodash.isEmpty(data) ? 204 : 200,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
    isBase64Encoded: false,
  };

  console.info('[RESPONSE]', JSON.stringify(response, null, 2));
  return response;
}

function errorFactory(error) {
  console.log(error);
  const errorKey = typeof error === 'string' ? error : error.msg;
  const errorResponse =
    dictionaryError.getValue(errorKey) || dictionaryError.getValue('default');

  return responseFactory(errorResponse.body, errorResponse.statusCode);
}

function getDictionary(dictionary) {
  return new Dictionary(dictionary);
}

module.exports = {
  getDictionary,
  errorFactory,
  responseFactory,
  lodash,
  log,
  ExcelJS
};
