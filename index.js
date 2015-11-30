var Parser = require('node-soda2-parser')

module.exports = function (input) {
  var ast = Parser.parse(input)
  var query = {
    outFields: '*',
    outStatistics: [],
    where: '1=1'
  }

  if (ast.columns instanceof Array) {
    query.outFields = [] // recast as array
    ast.columns.forEach(function (col) {
      if (col.expr.type === 'column_ref') {
        query.outFields.push(col.expr.column)
      } else if (col.expr.type === 'aggr_func') {
        query.outStatistics.push({
          statisticType: col.expr.name,
          onStatisticField: col.expr.args.expr.column,
          outStatisticFieldName: col.as || col.expr.name + '_' + col.expr.args.expr.column
        })
      }
    })
  }

  if (ast.groupby && ast.groupby.length) {
    query.groupByFieldsForStatistics = ast.groupby[0].column
  }

  if (ast.where) {
    query.where = Parser.stringify.where(ast.where)
  }

  return query
}
