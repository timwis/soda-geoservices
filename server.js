var process = require('process')
var restify = require('restify')
var request = require('request')
var qs = require('querystring')
var _ = { defaults: require('lodash/object/defaults') }
var convert = require('./convert')
require('dotenv').load({silent: true})

var DEBUG = process.env.DEBUG || false
var PORT = process.env.PORT || 8080
var PROXY_TO = process.env.PROXY_TO.replace(/\/$/, '') // remove trailing slash
var DEFAULT_PARAMS = process.env.DEFAULT_PARAMS ? qs.parse(process.env.DEFAULT_PARAMS) : null

var server = restify.createServer({ name: require('./package.json').name })
server.use(restify.queryParser())

// Catch all requests
server.get(/^\/(.*)/, function (req, res, next) {
  // Construct url
  var convertedQuery = _.defaults(convert(req.query), DEFAULT_PARAMS)
  var path = req.params[0].replace(/\/$/, '').replace(/query$/, '') // remove trailing slash and trailing /query
  var url = PROXY_TO + '/' + path + '/query'

  if (DEBUG) console.log(url, convertedQuery)

  // Pass along converted request
  request({
    url: url,
    qs: convertedQuery,
    json: true
  }, function (err, response, body) {
    if (err) {
      console.error('Error making request', response)
    } else {
      // Give the response back
      res.send(response.statusCode, body)
    }
  })
})

server.listen(PORT, function () {
  console.log('%s listening at %s', server.name, server.url)
})
