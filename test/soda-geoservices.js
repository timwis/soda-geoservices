/* global describe, it */
require('should')
var convert = require('../convert')
// var inspect = function (data) {
//   console.log(require('util').inspect(data, false, 10, true))
// }

describe('select', function () {
  it('all fields', function () {
    var query = convert('$select=*')
    query.should.have.property('outFields', '*')
  })

  it('multiple fields', function () {
    var query = convert('$select=foo, bar')
    query.should.have.property('outFields', 'foo, bar')
  })

  /* must be done in post-processing
  it('field aliases', function () {
    var query = convert('$select=foo AS bar')
  })*/

  /* must be done in post-processing
  (it('operators', function () {
    var query = convert('$select=foo * 3 AS bar')
  })*/
})

describe('where', function () {
  it('simple filters', function () {
    var query = convert('foo=1&baz=quz')
    query.should.have.property('where', "foo = 1 AND baz = 'quz'")
  })

  it('boolean operators', function () {
    var query = convert('$where=foo > 1 and baz="quz"')
    query.should.have.property('where', "foo > 1 AND baz = 'quz'")
  })

  it('order of operations', function () {
    var query = convert('$where=foo = 1 and (bar = 2 or baz = 3)')
    query.should.have.property('where', 'foo = 1 AND (bar = 2 OR baz = 3)')
  })
})

describe('group', function () {
  it('group by', function () {
    var query = convert('$group=foo')
    query.should.have.property('groupByFieldsForStatistics', 'foo')
  })

  it('aggregation', function () {
    // count, sum, avg, stddev, var, min, max
    var query = convert('$select=foo, sum(bar)')
    query.should.have.property('outStatistics', JSON.stringify([{
      statisticType: 'sum',
      onStatisticField: 'bar',
      outStatisticFieldName: 'sum_bar'
    }]))
  })

  it('aggregation with uppercase function name', function () {
    // count, sum, avg, stddev, var, min, max
    var query = convert('$select=foo, SUM(bar)')
    query.should.have.property('outStatistics', JSON.stringify([{
      statisticType: 'SUM',
      onStatisticField: 'bar',
      outStatisticFieldName: 'sum_bar'
    }]))
  })

  it('aggregation with wildcard', function () {
    // count, sum, avg, stddev, var, min, max
    var query = convert('$select=foo, count(*)')
    query.should.have.property('outStatistics', JSON.stringify([{
      statisticType: 'COUNT',
      onStatisticField: 'OBJECTID',
      outStatisticFieldName: 'count'
    }]))
  })

  it('aggregation with aliases', function () {
    var query = convert('$select=sum(foo) AS bar')
    query.should.have.property('outStatistics', JSON.stringify([{
      statisticType: 'sum',
      onStatisticField: 'foo',
      outStatisticFieldName: 'bar'
    }]))
  })
})

describe('other', function () {
  it('order with direction', function () {
    var query = convert('$order=foo, bar desc')
    query.should.have.property('orderByFields', 'foo, bar desc')
  })

  it('limit', function () {
    var query = convert('$limit=5000')
    query.should.have.property('resultRecordCount', '5000')
  })

  it('offset', function () {
    var query = convert('$offset=100')
    query.should.have.property('resultOffset', '100')
  })

  // it('free-text search', function () {})
})

describe('select functions', function () {
  it('extent', function () {
    var query = convert('$select=extent(location)')
    query.should.have.property('returnExtentOnly', true)
    query.outFields.should.eql('')
  })

  it('extent with count', function () {
    var query = convert('$select=count(*), extent(location)')
    query.should.have.property('returnExtentOnly', true)
    query.should.have.property('returnCountOnly', true)
    query.outFields.should.eql('')
  })

  // it('convex hull', function () {})

  /* not sure how to query geoservices this way
  it('date format', function () {
    var query = convert('$select=date_trunc_ym(date)')
  })*/

  /* pretty sure this is supported via UPPER()/LOWER()
  it('upper/lower case', function () {
    var query = convert('$select=lower(foo)')
  })*/

  // it('case', function () {})
})

describe('where functions', function () {
  it('between', function () {
    var query = convert('$where=salary between 40000 and 60000')
    query.where.should.be.eql('salary BETWEEN 40000 AND 60000')
  })

  /* not supported by node-soda2-parser (specifically, its underlying grammar)
  it('not between', function () {
    var query = convert('$where=salary not between 40000 and 60000')
    query.where.should.be.eql('salary NOT BETWEEN 40000 AND 60000')
  })*/

  it('in', function () {
    var query = convert("$where=foo in ('bar', 'baz')")
    query.where.should.be.eql("foo IN ('bar', 'baz')")
  })

  it('not in', function () {
    var query = convert("$where=foo not in ('bar', 'baz')")
    query.where.should.be.eql("foo NOT IN ('bar', 'baz')")
  })

  it('starts with', function () {
    var query = convert("$where=starts_with(foo, 'bar')")
    query.where.should.be.eql("foo LIKE 'bar%'")
  })

  // it('date format', function () {})

  // https://dev.socrata.com/docs/functions/within_box.html
  it('within box', function () {
    var query = convert('$where=within_box(location, 46, -122, 47, -123)')
    query.should.have.property('geometryType', 'esriGeometryEnvelope')
    query.should.have.property('geometry', '-122, 46, -123, 47')
    query.where.should.be.eql('1 = 1')
  })

  // https://dev.socrata.com/docs/functions/within_circle.html
  it('within circle', function () {
    var query = convert('$where=within_circle(location, 47, -122, 500)')
    query.should.have.property('geometryType', 'esriGeometryPoint')
    query.should.have.property('geometry', '-122, 47')
    query.should.have.property('distance', 500)
    // query.should.have.property('units', 'meters') // not documented
    query.where.should.be.eql('1 = 1')
  })

  /* not sure whether to use Multipoint or Polygon
  it('within polygon', function () {
    var query = convert("$where=within_polygon(location, 'MULTIPOLYGON (((-1.1 2.1, -3.1 4.1, -5.1 6.1, -7.1 8.1)))')")
  })*/
})
