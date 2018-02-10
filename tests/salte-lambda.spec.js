import test from 'ava';

import wrapper from '../src/salte-lambda.js';

test.cb('should suppot successful callbacks', (t) => {
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

test.cb('should suppot failed callbacks', (t) => {
  const handler = wrapper((event) => {
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
        statusCode: 404,
        code: 'not_found',
        message: 'Not Found'
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
  const handler = wrapper((event) => {
    return Promise.reject({
      statusCode: 404,
      code: 'not_found',
      message: 'Not Found'
    });
  });

  const error = await t.throws(handler({
    body: JSON.stringify()
  }));

  t.deepEqual(error, {
    statusCode: 404,
    code: 'not_found',
    message: 'Not Found'
  });
});

test('should support default the code and status code of failed responses', async (t) => {
  const handler = wrapper((event) => {
    return Promise.reject({
      message: 'Not Found'
    });
  });

  const error = await t.throws(handler({
    body: JSON.stringify()
  }));

  t.deepEqual(error, {
    statusCode: 500,
    code: 'internal_server_error',
    message: 'Not Found'
  });
});

test('should overriding the formatError funtion', async (t) => {
  const handler = wrapper((event) => {
    return Promise.reject({
      message: 'Not Found'
    });
  }, {
    formatError: function(error) {
      return {
        statusCode: error.statusCode || 500,
        type: error.type || 'internal_server_error',
        message: error.message
      };
    }
  });

  const error = await t.throws(handler({
    body: JSON.stringify()
  }));

  t.deepEqual(error, {
    statusCode: 500,
    type: 'internal_server_error',
    message: 'Not Found'
  });
});
