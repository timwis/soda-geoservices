module.exports = function (columns, query) {
  var outFields = columns

  if (columns instanceof Array) {
    outFields = [] // recast as array
    columns.forEach(function (col) {
      if (col.expr.type === 'column_ref') {
        outFields.push(col.expr.column)
      } else if (col.expr.type === 'aggr_func') {
        // aggregation
        query.outStatistics.push({
          statisticType: col.expr.name,
          onStatisticField: col.expr.args.expr.column,
          outStatisticFieldName: col.as || col.expr.name + '_' + col.expr.args.expr.column
        })
      }
    })
  }

  return outFields
}
