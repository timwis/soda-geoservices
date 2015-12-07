var qs = require('querystring')
var Parser = require('node-soda2-parser')
var allowedParams = require('./allowed-params.json')  // Geoservices params that should be accepted in addition to SODA2 params
var converters = {
  select: require('./lib/select'),
  where: require('./lib/where')
}

module.exports = function (input) {
  var query = {
    outFields: '*',
    where: '1=1',
    f: 'json'
  }

  // Save allowed params, then parse into AST
  var params = typeof input === 'string' ? qs.parse(input) : input
  allowedParams.forEach(function (param) {
    if (param in params) {
      query[param] = params[param]
      delete params[param]
    }
  })
  var ast = Parser.parse(params)

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
