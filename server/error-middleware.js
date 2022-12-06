const { JsonWebTokenError } = require('jsonwebtoken');
const ClientError = require('./client-error');

function errorMiddleware(err, req, res, next) {
  if (err instanceof ClientError) {
    res.status(err.status).json({
      error: err.message
    });
  } else if (err instanceof JsonWebTokenError) {
    res.status(401).json({
      error: 'Invalid access token.'
    });
  } else {
    console.error(err);
    res.status(500).json({
      error: 'An unexpected error occurred.'
    });
  }
}

module.exports = errorMiddleware;
