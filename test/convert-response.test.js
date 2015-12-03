/* global describe, it, before */
require('should')
var convert = require('../convert-response')
// var inspect = function (data) {
//   console.log(require('util').inspect(data, false, 10, true))
// }

describe('response', function () {
  var sipEsri = require('./sample-data/sip-esri.json')
  var sipSoda = require('./sample-data/sip-soda.json')

  it('converts', function () {
    converted = convert(sipEsri)
    converted.should.deepEqual(sipSoda)
  })
})
