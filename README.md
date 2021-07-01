# Salte Lambda

[![NPM Version][npm-version-image]][npm-url]
[![NPM Downloads][npm-downloads-image]][npm-url]
[![CI Build][github-actions-image]][github-actions-url]
[![Coveralls][coveralls-image]][coveralls-url]

[![semantic-release][semantic-release-image]][semantic-release-url]

An opinionated wrapper for AWS Lambda that enables the use of Promises.

## Install

You can install this package either with `npm`.

## npm

```sh
$ npm install @salte-io/salte-lambda
```

## Usage

```js
const wrapper = require('@salte-io/salte-lambda');

exports.handler = wrapper((event, context) => {
  if (!event.body.myAttribute) {
    return Promise.reject({
      statusCode: 400,
      code: 'missing_my_attribute',
      message: '"myAttribute" is required!'
    });
  }

  return Promise.resolve({
    my_attribute: event.body.myAttribute
  });
});
```

[npm-version-image]: https://img.shields.io/npm/v/@salte-io/salte-lambda.svg?style=flat
[npm-downloads-image]: https://img.shields.io/npm/dm/@salte-io/salte-lambda.svg?style=flat
[npm-url]: https://npmjs.org/package/@salte-io/salte-lambda

[github-actions-image]: https://github.com/salte-io/salte-lambda/actions/workflows/ci.yml/badge.svg?branch=master
[github-actions-url]: https://github.com/salte-io/salte-lambda/actions/workflows/ci.yml

[coveralls-image]: https://img.shields.io/coveralls/salte-io/salte-lambda/master.svg
[coveralls-url]: https://coveralls.io/github/salte-io/salte-lambda?branch=master

[semantic-release-url]: https://github.com/semantic-release/semantic-release
[semantic-release-image]: https://img.shields.io/badge/%20%20%F0%9F%93%A6%F0%9F%9A%80-semantic--release-e10079.svg
