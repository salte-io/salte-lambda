# Salte Lambda

[![Gitter][gitter-image]][gitter-url]
[![NPM Version][npm-version-image]][npm-url]
[![NPM Downloads][npm-downloads-image]][npm-url]
[![Travis][travis-ci-image]][travis-ci-url]
[![Coveralls][coveralls-image]][coveralls-url]

[![Commitizen friendly][commitizen-image]][commitizen-url]
[![semantic-release][semantic-release-image]][semantic-release-url]
[![Greenkeeper badge][greenkeeper-image]][greenkeeper-url]

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

[gitter-image]: https://badges.gitter.im/salte-io/salte-lambda.svg
[gitter-url]: https://gitter.im/salte-io/salte-lambda?utm_source=badge&utm_medium=badge&utm_campaign=pr-badge

[npm-version-image]: https://img.shields.io/npm/v/@salte-io/salte-lambda.svg?style=flat
[npm-downloads-image]: https://img.shields.io/npm/dm/@salte-io/salte-lambda.svg?style=flat
[npm-url]: https://npmjs.org/package/@salte-io/salte-lambda

[travis-ci-image]: https://img.shields.io/travis/salte-io/salte-lambda/master.svg?style=flat
[travis-ci-url]: https://travis-ci.org/salte-io/salte-lambda

[coveralls-image]: https://img.shields.io/coveralls/salte-io/salte-lambda/master.svg
[coveralls-url]: https://coveralls.io/github/salte-io/salte-lambda?branch=master

[commitizen-image]: https://img.shields.io/badge/commitizen-friendly-brightgreen.svg
[commitizen-url]: https://commitizen.github.io/cz-cli/

[semantic-release-url]: https://github.com/semantic-release/semantic-release
[semantic-release-image]: https://img.shields.io/badge/%20%20%F0%9F%93%A6%F0%9F%9A%80-semantic--release-e10079.svg

[greenkeeper-image]: https://badges.greenkeeper.io/salte-io/salte-lambda.svg
[greenkeeper-url]: https://greenkeeper.io
