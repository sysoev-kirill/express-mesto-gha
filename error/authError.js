const { ERROR_AUTH } = require('./constantsErrors');

class AuthError extends Error {
  constructor(message) {
    super(message);
    this.statusCode = ERROR_AUTH;
  }
}

module.exports = AuthError;
