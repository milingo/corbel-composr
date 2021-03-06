'use strict'

var corbel = require('corbel-js')
var config = require('config')
var _ = require('lodash')
var ComposrError = require('./ComposrError')
var logger = require('../utils/composrLogger')

var PHRASES_COLLECTION = 'composr:Phrase'
var SNIPPETS_COLLECTION = 'composr:Snippet'

var corbelConfig = config.get('corbel.options')
corbelConfig = _.extend(corbelConfig, config.get('corbel.credentials'))

var extractDomain = function (accessToken) {
  try {
    var decoded = corbel.jwt.decode(accessToken.replace('Bearer ', ''))
    return decoded.domainId
  } catch (e) {
    logger.error('error:invalid:token', accessToken)
    return null
  }
}

var getTokenDriver = function (accessToken, emptyIfNotAuth) {
  if (!accessToken && !emptyIfNotAuth) {
    throw new ComposrError('error:connection:undefined:accessToken')
  } else if (accessToken) {
    var iamToken = {
      'accessToken': accessToken.replace('Bearer ', '')
    }

    var corbelConfig = {
      urlBase: config.get('corbel.options.urlBase')
    }

    corbelConfig.iamToken = iamToken
    corbelConfig.domain = extractDomain(accessToken)

    return corbel.getDriver(corbelConfig)
  } else {
    return corbel.getDriver({
      urlBase: config.get('corbel.options.urlBase'),
      iamToken: ''
    })
  }
}

module.exports.SNIPPETS_COLLECTION = SNIPPETS_COLLECTION
module.exports.PHRASES_COLLECTION = PHRASES_COLLECTION
module.exports.extractDomain = extractDomain
module.exports.getTokenDriver = getTokenDriver
