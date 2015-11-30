/* global describe, it */
require('should')
var convert = require('../index')
/* var inspect = function (data) {
  console.log(require('util').inspect(data, false, 10, true))
} */

describe('select', function () {
  it('multiple fields', function () {
    var query = convert('$select=foo, bar')
    query.should.have.property('outFields', ['foo', 'bar'])
  })

  /* must be done in post-processing
  it('field aliases', function () {
    var query = convert('$select=foo AS bar')
  })*/

  /* must be done in post-processing
  (it('operators', function () {
    var query = convert('$select=foo * 3 AS bar')
  })*/

  it('aggregation', function () {
    // count, sum, avg, stddev, var, min, max
    var query = convert('$select=foo, sum(bar)')
    query.should.have.property('outStatistics', [{
      statisticType: 'sum',
      onStatisticField: 'bar',
      outStatisticFieldName: 'sum_bar'
    }])
  })

  it('aggregation with aliases', function () {
    var query = convert('$select=sum(foo) AS bar')
    query.outStatistics[0].should.have.property('outStatisticFieldName', 'bar')
  })

  it('group by', function () {
    var query = convert('$group=foo')
    query.should.have.property('groupByFieldsForStatistics', 'foo')
  })

  /* not sure how to query geoservices this way
  it('date parts', function () {
    var query = convert('$select=date_trunc_ym(date)')
  })*/

  /* pretty sure this is supported via UPPER()/LOWER()
  it('lower/upper case', function () {
    var query = convert('$select=lower(foo)')
  })*/
})

describe('filter', function () {
  it('named filters', function () {
    var query = convert('foo=1&baz=quz')
    query.should.have.property('where', "foo = 1 AND baz = 'quz'")
  })

  it('$where filters', function () {
    var query = convert('$where=foo = 1 and baz="quz"')
    query.should.have.property('where', "foo = 1 AND baz = 'quz'")
  })
})

describe('pagination', function () {

})
