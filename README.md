<p align="center"><img align="center" src="https://raw.githubusercontent.com/corbel-platform/corbel-composr/master/img/logo.png" width="200"></p>

#Composr

[![Build Status](https://api.travis-ci.org/corbel-platform/corbel-composr.png?branch=master)](http://travis-ci.org/corbel-platform/corbel-composr)
[![npm version](https://badge.fury.io/js/corbel-composr.svg)](http://badge.fury.io/js/corbel-composr)
[![Dependency status](https://david-dm.org/corbel-platform/corbel-composr/status.png)](https://david-dm.org/corbel-platform/corbel-composr#info=dependencies&view=table)
[![Dev Dependency Status](https://david-dm.org/corbel-platform/corbel-composr/dev-status.png)](https://david-dm.org/corbel-platform/corbel-composr#info=devDependencies&view=table)
[![Coverage Status](https://coveralls.io/repos/corbel-platform/corbel-composr/badge.svg?branch=master)](https://coveralls.io/r/corbel-platform/corbel-composr?branch=master)
[![js-standard-style](https://img.shields.io/badge/code%20style-standard-brightgreen.svg)](http://standardjs.com/)
[![Code Climate](https://codeclimate.com/github/corbel-platform/corbel-composr/badges/gpa.svg)](https://codeclimate.com/github/corbel-platform/corbel-composr)
[![Test Coverage](https://codeclimate.com/github/corbel-platform/corbel-composr/badges/coverage.svg)](https://codeclimate.com/github/corbel-platform/corbel-composr/coverage)

<p align="center"><img  src="https://cdn.rawgit.com/feross/standard/master/badge.svg" width="150"></p>


## [Homepage](http://corbel-platform.github.io/corbel-composr)

## Overview

Composr is a [nodeJS](https://nodejs.org/api/) opinionated server for executing dinamically created endpoints, it's original purpose is to serve as a middleware for the [Corbel - microservices generic backend - ][corbel-link], but it's capabilities are growing.

It uses the [composr-core](https://github.com/bq/composr-core) API for executing random pieces of code that the developers pushes to the Composr API.
This random pieces of code, called **Phrases** or **Snippets** are model definitions for endpoints and reusable utilities. 


## Features

- Enable/disable endpoints in runtime dynamically!
- Built in PM2 configuration for cluster mode
- Bunyan Access logs
- Winston Logs (debug, info, warn, error)
- Dynamic versioning support
- Autogenerated API documentation
- RabbitMQ communication for endpoints updates
- Status and Healthcheck endpoints
- Keymetrics and Newrelic integration
- Docker Ready!
- Configurable middlewares for each endpoint
  + Mock: It mocks the response of the endpoint with an autogenerated object
  + Validate: It validates the input object schema for POST/PUT requests
  + Auth Middlewares: Ensures that the endpoint receives a Corbel Auth Token
  + Cache Middlewares: Configure which endpoints will be cached and for how long. 
  + ...
- [Corbel][corbel-link] ready, thanks to [Corbel-js](https://github.com/bq/corbel-js)


## QuickStart

- install

  ```
  npm install -g corbel-platform/corbel-composr
  ```

- run server

  ```
  corbel-composr
  ```

## Configuration

One way of starting composr is using it as a command, `corbel-composr`.

This will search for the default configuration under a `config` folder in the current directory. Composr uses the NPM [config](https://www.npmjs.com/package/config) module for the configuration. So it will basically search for a `development.json` file under the `config` folder.

_If NODE_ENV is not set in the environment, a default value of `development` is used._

### Default config file

```
{
    "serverName" : "CompoSR",
    "bodylimit" : "50mb",
    "port": 3000,
    
    "rabbitmq": {
        "host": "",
        "port": "",
        "username": "",
        "password": "",
        "reconntimeout": 10000,
        "event": "class com.bq.corbel.event.ResourceEvent",
        "forceconnect": false,
        "heartbeat" : 30
    },

    "bootstrap.retrytimeout": 10000,

    "services": {
        "timeout": 5000,
        "retries": 30,
        "time": 1000
    },

    "corbel": {
        "credentials": {
            "clientId": "",
            "clientSecret": "",
            "scopes": "composr:comp:base"
        },
        "options": {
            "urlBase": ""
        }
    },

    "bunyan": {
        "log" : true,
        "syslog" : true,
        "stdout": false,
        "streamServer": false
    },

    "composrLog": {
        "accessLog" : true,
        "accessLogFile" : "logs/access.log",
        "logLevel": "error",
        "logFile": "logs/composr.log",
        "syslog" : false
    },

    "newrelic": {
        "enabled": false,
        "name": "",
        "key": ""
    },

    "keymetrics": true,

    "execution": {
        "vm": false,
        "gc": false,
        "timeout": 40000,
        "local": false
    }
}

```

Almost all of the vales in the configuration file can be overwriten by environment variables, this can be useful if you use **Docker**, **Travis** or any other tool that could send environment variables to configure your server. 

### Environment variables

```
SERVER_NAME (Composr 2.0)
PORT (3000)
CREDENTIALS_CLIENT_ID
CREDENTIALS_CLIENT_SECRET
CREDENTIALS_SCOPES
URL_BASE
ACCESS_LOG => winston access log
ACCESS_LOG_FILE => winston access log file
LOG_LEVEL => winston log level
LOG_FILE => winston log file
BUNYAN_LOG(true) => Bunyan logs
BUNYAN_SYSLOG(true) => Send bunyan stream to syslog (127.0.0.1:514)
BUNYAN_STDOUT(false) => Bunyan output in terminal
BUNYAN_STREAM_SERVER (null) => Composr Stream Server endpoint
RABBITMQ_HOST
RABBITMQ_PORT
RABBITMQ_USERNAME
RABBITMQ_PASSWORD
RABBITMQ_FORCE_CONNECT => Only launch composr if rabbit is connected
RABBITMQ_HEARTBEAT => Heartbeat for the rabbitmq connection
SERVICES_TIMEOUT
SERVIES_RETRIES
SERVICES_TIME 
KEYMETRICS (true) => Keymetrics active
NRACTIVE => New relic active
NRAPPNAME => New relic app name
NRAPIKEY => New relic api key
TIMEOUT=> Endpoint timeout
LOCAL_MODE=>If set to "true" it skips loading the endpoints from a remote server and uses the local files
```

## Creating your endpoints:

[What are Phrases or Snippets?](https://github.com/corbel-platform/composr-core/wiki/Phrases)

You can generate and publish your phrases and snippets by using the [composr-cli](https://github.com/corbel-platform/composr-cli). *Currently under development*

### Bootstraping a project:

`composr init` will generate a basic structure for your Phrases project. 

Once you bootstrapped some `phrases`, just run `corbel-composr` in the current folder and the server will be ready at the port `3000`.


### Routing endpoints

Corbel-Composr has a similar routing mechanism than restify. You can define urls by following this conventions:

- `:param` : Url parameter
- `user` : Fixed path value

Some examples

- `user/:userId`
- `user/status/:parameter`
- `thing/one`

```json
{
    "url": "paramsExample/:pathparam",
    "get": {
        "code": "res.status(200).send('path param: ' + req.params.pathparam + ',  query param: ' + req.query.queryparam);"
    },
    "post": {
       /*...*/
    },
    "put": {
       /*...*/
    }
}
```

### Versioning your endpoints

Composr can take care of multiple endpoints and multiple versions for each endpoint. It uses the semantic versioning for executing different code for each endpoint. 

For example, if you published the following phrases to Composr:

```
{
    "url": "user/:userId",
    "version": "3.1.0",
    "get": { ... }
}

{
    "url": "user/:userId",
    "version": "4.0.0",
    "get": { ... }
}
```

Then you could request executing the `3.x` version by sending the `Accept-Version` header with a `~3` value, as seen in [restify](http://restify.com/).

### Documentation

Composr autogenerates documentation when navigating to `http://localhost:3000/my:domain/doc`. The documentation is generated by fulfilling the example documents that `composr-cli` creates when generating a phrase model.

See an example:
![documentation example](https://raw.githubusercontent.com/corbel-platform/corbel-composr/master/img/example-doc.png)

### Phrase Middlewares

We offer a set of plugable add-ons that will automatically add functionality to your phrases. 
These middlewares or hooks are executed before or after the code on your phrase. 
You can specify them on the phrase's spec at a method level like this (order is important!):

```
{
  "url": "resource",
  "get": {
    "middlewares": [
      "auth"
      "validate", 
      "mock"
    ],
    "doc": {
...
}
```
  
Among the available middlewares you can find:

- 'corbel-auth-client': Automatic corbel authentication for clients
- 'corbel-auth-user': Automatic corbel authentication for users. A new attribute 'userId' will be available on the phrase for a succeeding user token.
- 'validate': Automatic validation of path params, query params and body based on documentations' schema
- 'mock': Mocked responses based on schema or example from documentation 

## Logs

**Composr** is shipped with built-in **bunyan** and **winston** support.

### Winston logs:

You can set `logFile` and `logLevel` in your config file.

Available log levels can be found at [winston's npm page](https://www.npmjs.com/package/winston#logging-levels):
- debug
- info
- warn
- error

### Bunyan Logs:

Bunyan logs are enabled by default. You can disable them by turning `bunyan.log` to `false` in your configuration.


## Tests

```
npm test
```


### Coverage

```
npm run coverage
```


### Debug

Requires [node-inspector](https://github.com/node-inspector/node-inspector)
```
npm install -g node-inspector
```

* Server

  ```
  npm run debug --myphrase.get
  ```

* Tests

  ```
  npm run test:debug
  ```


## Run in a docker container

- clone repo
- build image

  ```
  docker build -t <username>/corbel-composr .
  ```

- run container

  ```
  docker run -d -p 3000:3000 --name="corbel-composr"  <username>/corbel-composr
  ```

- start/stop container

  ```
  docker start/stop corbel-composr
  ```


[corbel-link]: https://github.com/bq/corbel

## Reference

* [composr-core](https://github.com/corbel-platform/composr-core)
* [corbel-js](https://github.com/corbel-platform/corbel-js) API
* [RAML](http://raml.org/) for phrase definition
