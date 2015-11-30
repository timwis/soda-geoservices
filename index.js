var qs = require('querystring')
var Parser = require('node-soda2-parser')
var processors = {
  select: require('./lib/select'),
  where: require('./lib/where')
}

module.exports = function (input) {
  var params = qs.parse(input)
  var ast = Parser.parse(params)
  var query = {
    outFields: '*',
    outStatistics: [],
    where: '1=1'
  }

  query.outFields = processors.select(ast.columns, query)

  if (ast.groupby && ast.groupby.length) {
    query.groupByFieldsForStatistics = ast.groupby[0].column
  }

  if (ast.where) {
    ast.where = processors.where(ast.where, query)
    query.where = Parser.stringify.where(ast.where)
  }

  if (params.$order) {
    query.orderByFields = params.$order
  }

  if (params.$limit) {
    query.resultRecordCount = +params.$limit
  }

  if (params.$offset) {
    query.resultOffset = +params.$offset
  }

  return query
}
