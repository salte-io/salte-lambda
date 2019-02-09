import test from 'ava';

import wrapper from '../src/salte-lambda.js';

test.cb('should support successful callbacks', (t) => {
  const handler = wrapper((event) => {
    return event.body;
  });

  handler({
    body: JSON.stringify({
      name: 'jim'
    })
  }, null, (error, response) => {
    t.deepEqual(response, {
      statusCode: 200,
      body: JSON.stringify({
        name: 'jim'
      }),
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Methods': 'POST',
        'Access-Control-Allow-Headers': 'Content-Type,X-Amz-Date,Authorization,X-Api-Key,X-Amz-Security-Token',
        'Access-Control-Allow-Origin': '*'
      }
    });
    t.end();
  });
});

test.cb('should support failed callbacks', (t) => {
  const handler = wrapper(() => {
    return Promise.reject({
      statusCode: 404,
      code: 'not_found',
      message: 'Not Found'
    });
  });

  handler({
    body: JSON.stringify({
      name: 'jim'
    })
  }, null, (error, response) => {
    t.deepEqual(response, {
      statusCode: 404,
      body: JSON.stringify({
        message: 'Not Found',
        statusCode: 404,
        code: 'not_found'
      }),
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Methods': 'POST',
        'Access-Control-Allow-Headers': 'Content-Type,X-Amz-Date,Authorization,X-Api-Key,X-Amz-Security-Token',
        'Access-Control-Allow-Origin': '*'
      }
    });
    t.end();
  }).catch(() => {});
});

test('should support successful responses', async (t) => {
  const handler = wrapper((event) => {
    return event.body;
  });

  const response = await handler({
    body: JSON.stringify({
      name: 'jim'
    })
  });

  t.deepEqual(response, {
    name: 'jim'
  });
});

test('should not parse the body if the "Content-Type" is not application/json', async (t) => {
  const handler = wrapper((event) => {
    return event.body;
  });

  const response = await handler({
    body: JSON.stringify({
      name: 'jim'
    }),
    headers: {
      'content-type': 'application/xml'
    }
  });

  t.deepEqual(response, JSON.stringify({
    name: 'jim'
  }));
});

test('should support conditionally parsing the body', async (t) => {
  const handler = wrapper((event) => {
    return event.body;
  });

  const response = await handler({
    body: {
      name: 'jim'
    }
  });

  t.deepEqual(response, {
    name: 'jim'
  });
});

test('should default the body', async (t) => {
  const handler = wrapper((event) => {
    return event.body;
  });

  const response = await handler({});

  t.deepEqual(response, {});
});

test('should support failed responses', async (t) => {
  const handler = wrapper(() => {
    return Promise.reject({
      statusCode: 404,
      code: 'not_found',
      message: 'Not Found'
    });
  });

  const error = await t.throwsAsync(handler({
    body: JSON.stringify()
  }));

  t.is(error.statusCode, 404);
  t.is(error.code, 'not_found');
  t.is(error.message, 'Not Found');
});

test('should support defaulting the code and status code of failed responses', async (t) => {
  const handler = wrapper(() => {
    return Promise.reject({
      message: 'Not Found'
    });
  });

  const error = await t.throwsAsync(handler({
    body: JSON.stringify()
  }));

  t.is(error.statusCode, 500);
  t.is(error.code, 'internal_server_error');
  t.is(error.message, 'Not Found');
});

test('should support a dynamic code based on the status code', async (t) => {
  const handler = wrapper(() => {
    return Promise.reject({
      statusCode: 404,
      message: 'Not Found'
    });
  });

  const error = await t.throwsAsync(handler({
    body: JSON.stringify()
  }));

  t.is(error.statusCode, 404);
  t.is(error.code, 'not_found');
  t.is(error.message, 'Not Found');
});

test('should support overriding the formatError funtion', async (t) => {
  const handler = wrapper(() => {
    return Promise.reject({
      message: 'Not Found'
    });
  }, {
    formatError: function(options) {
      const error = new Error(options.message);
      error.statusCode = options.statusCode || 500;
      error.type = options.type || 'internal_server_error';
      return error;
    }
  });

  const error = await t.throwsAsync(handler({
    body: JSON.stringify()
  }));

  t.is(error.statusCode, 500);
  t.is(error.type, 'internal_server_error');
  t.is(error.message, 'Not Found');
});
