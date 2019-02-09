module.exports = function(handler, options) {
  options = Object.assign({
    formatError: function(options) {
      const status = require('statuses');
      const statusCode = options.statusCode || 500;

      const error = new Error();
      error.message = options.message;
      error.statusCode = statusCode;
      error.code = options.code || status[statusCode].toLowerCase().replace(/\s/g, '_');
      return error;
    }
  }, options);

  return function(event, context, callback) {
    return Promise.resolve().then(() => {
      const contentType = event.headers && event.headers['content-type'] || 'application/json';
      if (contentType.indexOf('application/json') !== -1) {
        if (!event.body) {
          event.body = {};
        } else if (typeof event.body === 'string') {
          event.body = JSON.parse(event.body);
        }
      }

      return Promise.resolve(handler(event, context)).then((response) => {
        if (callback) {
          callback(null, {
            statusCode: 200,
            body: JSON.stringify(response),
            headers: {
              'Content-Type': 'application/json',
              'Access-Control-Allow-Methods': 'POST',
              'Access-Control-Allow-Headers': 'Content-Type,X-Amz-Date,Authorization,X-Api-Key,X-Amz-Security-Token',
              'Access-Control-Allow-Origin': '*'
            }
          });
        }

        return response;
      });
    }).catch((error) => {
      error = options.formatError(error);

      if (callback) {
        callback(null, {
          statusCode: error.statusCode,
          body: JSON.stringify(error),
          headers: {
            'Content-Type': 'application/json',
            'Access-Control-Allow-Methods': 'POST',
            'Access-Control-Allow-Headers': 'Content-Type,X-Amz-Date,Authorization,X-Api-Key,X-Amz-Security-Token',
            'Access-Control-Allow-Origin': '*'
          }
        });
      }

      // NOTE: Should we be throwing this error even if the callback is defined... ?
      // Are there any repercussions?
      return Promise.reject(error);
    });
  };
};
