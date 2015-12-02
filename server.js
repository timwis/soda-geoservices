var process = require('process')
var restify = require('restify')
var request = require('request')
var convert = require('./convert')
require('dotenv').load({silent: true})

var PORT = process.env.PORT || 8080
var IP = process.env.IP || '127.0.0.1'
var PROXY_TO = process.env.PROXY_TO.replace(/\/$/, '') // remove trailing slash

var server = restify.createServer({ name: require('./package.json').name })
server.use(restify.queryParser())

// Catch all requests
server.get(/^\/(.*)/, function (req, res, next) {
  // Construct url
  var convertedQuery = convert(req.query)
  var path = req.params[0].replace(/\/$/, '').replace(/query$/, '') // remove trailing slash and trailing /query
  var url = PROXY_TO + '/' + path + '/query'

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

server.listen(PORT, IP, function () {
  console.log('%s listening at %s', server.name, server.url)
})
