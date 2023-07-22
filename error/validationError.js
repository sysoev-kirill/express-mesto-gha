const { ERROR_CODE } = require('./constantsErrors');

class ValidationError extends Error {
  constructor(message) {
    super(message);
    this.statusCode = ERROR_CODE;
  }
}

module.exports = ValidationError;
