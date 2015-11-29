var convert = require('../index')
require('should')

describe('select', function() {
	
	it('multiple fields', function() {
		var query = convert('$select=foo, bar')
		query.should.have.property('outFields', ['foo', 'bar'])
	})
	
	it('field aliases', function() {
		var query = convert('$select=foo AS bar')
		// must be done in post-processing
	})
	
	it('operators', function() {
		var query = convert('$select=foo * 3 AS bar')
		// must be done in post-processing
	})
	
	it('aggregation', function() {
		// count, sum, avg, stddev, var, min, max
		var query = convert('$select=sum(foo)')
		query.should.have.property('groupByFieldsForStatistics', 'foo')
		query.should.have.property('outStatistics', [{
			statisticType: 'sum',
			onStatisticField: 'foo',
			outStatisticFieldName: 'sum_foo'
		}])
	})
	
	it('aggregation with aliases', function() {
		var query = convert('$select=sum(foo) AS bar')
		query.outStatistics.outStatisticFieldName.should.eql('bar')
	})
	
	it('date parts', function() {
		var query = convert('$select=date_trunc_ym(date)')
		// not sure how to query geoservices this way
	})
	
	it('lower/upper case', function() {
		var query = convert('$select=lower(foo)')
		// pretty sure this is supported via UPPER()/LOWER()
	})
	
})

describe('filter', function() {
	
	it('named filters', function() {
		var query = convert('foo=1&baz=quz')
		query.should.have.property('where')
		query.where.should.have.property('foo', 1)
		query.where.should.have.property('baz', 'quz')
	})
	
	it('$where filters', function() {
		var query = convert('$where=foo = 1, baz=quz')
		query.where.should.have.property('foo', 1)
		query.where.should.have.property('baz', 'quz')
	})
	
})

describe('pagination', function() {
	
})
