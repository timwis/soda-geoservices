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

  it('aggregation: sum', function () {
    // count, sum, avg, stddev, var, min, max
    var query = convert('$select=foo, sum(bar)')
    query.should.have.property('outStatistics', [{
      statisticType: 'sum',
      onStatisticField: 'bar',
      outStatisticFieldName: 'sum_bar'
    }])
  })

  it('aggregation: uppercase', function () {
    // count, sum, avg, stddev, var, min, max
    var query = convert('$select=foo, SUM(bar)')
    query.should.have.property('outStatistics', [{
      statisticType: 'SUM',
      onStatisticField: 'bar',
      outStatisticFieldName: 'sum_bar'
    }])
  })

  it('aggregation: count(*)', function () {
    // count, sum, avg, stddev, var, min, max
    var query = convert('$select=foo, count(*)')
    query.should.have.property('outStatistics', [{
      statisticType: 'COUNT',
      onStatisticField: 'OBJECTID',
      outStatisticFieldName: 'count'
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

  it('extent', function () {
    var query = convert('$select=extent(location)')
    query.should.have.property('returnExtentOnly', true)
    query.outFields.should.eql([])
  })

  it('extent with count', function () {
    var query = convert('$select=count(*), extent(location)')
    query.should.have.property('returnExtentOnly', true)
    query.should.have.property('returnCountOnly', true)
    query.outFields.should.eql([])
  })
})

describe('filter', function () {
  it('named filters', function () {
    var query = convert('foo=1&baz=quz')
    query.should.have.property('where', "foo = 1 AND baz = 'quz'")
  })

  it('$where filters', function () {
    var query = convert('$where=foo > 1 and baz="quz"')
    query.should.have.property('where', "foo > 1 AND baz = 'quz'")
  })

  // https://dev.socrata.com/docs/functions/within_box.html
  it('within_box', function () {
    var query = convert('$where=within_box(location, 46, -122, 47, -123)')
    query.should.have.property('geometryType', 'esriGeometryEnvelope')
    query.should.have.property('geometry', [-122, 46, -123, 47])
    query.where.should.be.eql('1 = 1')
  })

  // https://dev.socrata.com/docs/functions/within_circle.html
  it('within_circle', function () {
    var query = convert('$where=within_circle(location, 47, -122, 500)')
    query.should.have.property('geometry', [-122, 47])
    query.should.have.property('distance', 500)
    // query.should.have.property('units', 'meters') // not documented
    query.where.should.be.eql('1 = 1')
  })

  it('between', function () {
    var query = convert('$where=salary between 40000 and 60000')
    query.where.should.be.eql('salary BETWEEN 40000 AND 60000')
  })
})

describe('sorting', function () {
  it('order by', function () {
    var query = convert('$order=foo, bar desc')
    query.should.have.property('orderByFields', 'foo, bar desc')
  })
})

describe('pagination', function () {
  it('limit', function () {
    var query = convert('$limit=5000')
    query.should.have.property('resultRecordCount', 5000)
  })

  it('offset', function () {
    var query = convert('$offset=100')
    query.should.have.property('resultOffset', 100)
  })
})
