module.exports = function(handler, options) {
  options = Object.assign({
    formatError: function(error) {
      return {
        statusCode: error.statusCode || 500,
        code: error.code || 'internal_server_error',
        message: error.message
      };
    }
  }, options);

  return function(event, context, callback) {
    return Promise.resolve().then(() => {
      if (!event.body) {
        event.body = {};
      } else if (typeof event.body === 'string') {
        event.body = JSON.parse(event.body);
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
