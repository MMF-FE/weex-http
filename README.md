# weex-http
weex simple http lib

[![Build Status](https://img.shields.io/travis/MMF-FE/weex-http.svg?style=flat-square)](https://travis-ci.org/MMF-FE/weex-http) 
[![Coverage Status](https://img.shields.io/coveralls/MMF-FE/weex-http.svg?style=flat-square)](https://coveralls.io/r/MMF-FE/weex-http?branch=master)

## Installing

```
npm i weex-http --save-dev
# or
yarn add weex-http --dev
```

## Example

Performing a GET request

```js
import weexHttp from 'weex-http'

weexHttp.get('/user', {
    ID: 12345
})
.then(function (response) {
    console.log(response)
})
.catch(function (error) {
    console.log(error)
})
```

Performing a POST request

```js
weexHttp.post('/user', {
    firstName: 'Fred',
    lastName: 'Flintstone'
})
.then(function (response) {
    console.log(response);
})
.catch(function (error) {
    console.log(error);
})
```

## Creating an instance

You can create a new instance of axios with a custom config.

weexHttp.create([config])

```js
var instance = weexHttp.create({
    baseURL: 'https://some-domain.com/api/',
    timeout: 1000,
    headers: {'X-Custom-Header': 'foobar'}
})
```

## Options

- timeout number `default: 10000` ms
- headers any `default: {}`
- transformRequest Function[] `default: []` 
- transformHeaders Function[] `default: []` 
- transformResponse Function[] `default: []` 

## Instance methods

The available instance methods are listed below. The specified config will be merged with the instance config.

weexHttp#get(url[, data[, config]])

weexHttp#delete(url[, data[, config]])

weexHttp#head(url[, data[, config]])

weexHttp#post(url[, data[, config]])

weexHttp#put(url[, data[, config]])

weexHttp#patch(url[, data[, config]])

