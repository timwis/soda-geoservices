/* global describe, it */
require('should')
var convert = require('../convert-response')
// var inspect = require('../helpers/inspect')

describe('response', function () {
  var sipEsri = require('./sample-data/sip-esri.json')
  var sipSoda = require('./sample-data/sip-soda.json')

  it('converts', function () {
    var converted = convert(sipEsri)
    converted.should.deepEqual(sipSoda)
  })
})
