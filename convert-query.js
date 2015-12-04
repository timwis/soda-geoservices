var qs = require('querystring')
var Parser = require('node-soda2-parser')
var converters = {
  select: require('./lib/select'),
  where: require('./lib/where')
}

module.exports = function (input) {
  var params = typeof input === 'string' ? qs.parse(input) : input
  var ast = Parser.parse(params)
  var query = {
    outFields: '*',
    where: '1=1',
    f: 'json'
  }

  // Select
  query.outFields = converters.select(ast.columns, query)

  // Select Aggregation
  if (query.outStatistics) {
    query.outStatistics = JSON.stringify(query.outStatistics)
  }

  // Where
  if (ast.where) {
    ast.where = converters.where(ast.where, query)
    query.where = Parser.stringify.where(ast.where)
  }

  // Group by
  if (ast.groupby && ast.groupby.length) {
    query.groupByFieldsForStatistics = ast.groupby[0].column
  }

  // Order by
  if (params.$order) {
    query.orderByFields = params.$order
  }

  // Limit
  if (params.$limit) {
    query.resultRecordCount = params.$limit
  }

  // Offset
  if (params.$offset) {
    query.resultOffset = params.$offset
  }

  return query
}