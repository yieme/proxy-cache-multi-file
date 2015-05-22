'use strict';
/** Proxy and cache multiple files and related headers
 *
 *  @copyright  Copyright (C) 2015 by Yieme
 *  @module     proxyCacheMultiFile
 */

var _              = require('lodash')
var async          = require('async');
var proxyCacheFile = require('proxy-cache-file')
var ProxyCacheMultiFileError = require('make-error')('ProxyCacheMultiFileError')
var logger      = {
  info:  function(msg) { console.log('info:', msg) },
  debug: function(msg) { console.log('debug:', msg) },
  warn:  function(msg) { console.warn('warn:', msg) },
  error: function(msg) { console.error('error:', msg) },
  log:   console.log,
}
var options = {
  dir:    './tmp',
  logger: logger
}

function proxyCacheMultiFile(req, callback) {
  if ('string' === typeof req) req = { url: [req] }
  if (_.isArray(req))          req = { url: req }
  req = req || {}
  if (!_.isArray(req.url)) {
    if (_.isObject(req)) {
      options = req
      if (req.dir) proxyCacheFile({ dir: req.dir }) // pass-thru config
      return proxyCacheMultiFile
    }
    if (!_.isFunction(callback)) {
      throw new ProxyCacheMultiFileError('Array of request URL\'s required and invalid callback')
    }
    callback(new ProxyCacheMultiFileError('Array of request URL\'s required'))
  }

  options.logger.debug('proxyCacheMultiFile: ' + req.url)

  var requests = []
  req.url.forEach(function(elem) {
    requests.push({ url: elem, gzip: false, returnUrl: true })
  })

  if (requests.length == 1) {
    var request = requests[0]
    request.asStream = true
    return proxyCacheFile(request, callback)
  }

  async.map(requests, proxyCacheFile, function(err, results){
    if (err) throw err
    var objMap = {}
    var headers
    for(var i=0, len = results.length; i < len; i++) {
      headers = results[i].headers
      if (headers.code) return callback(null, results[i]) // error encountered
      objMap[results[i].url] = results[i]
    }
    var orderedResults = ''
    for(i=0, len = requests.length; i < len; i++) {
      if (i > 0) orderedResults += "\n"
      var pack = objMap[requests[i].url]
      orderedResults += pack.body
    }
    callback(null, { headers: headers, body: orderedResults})
  })
}


module.exports = proxyCacheMultiFile
