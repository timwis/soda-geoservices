module.exports = function (columns, query) {
  var outFields = columns

  if (columns instanceof Array) {
    outFields = [] // recast as array
    columns.forEach(function (col) {
      if (col.expr.type === 'column_ref') {
        outFields.push(col.expr.column)
      } else if (col.expr.type === 'aggr_func') {
        if (['count', 'sum', 'avg', 'stddev', 'var', 'min', 'max'].indexOf(col.expr.name.toLowerCase()) !== -1) {
          // aggregation
          var subjectField = col.expr.args.expr.type === 'star' ? 'OBJECTID' : col.expr.args.expr.column
          var fieldName = col.expr.name + (col.expr.args.expr.type === 'star' ? '' : '_' + col.expr.args.expr.column)

          query.outStatistics.push({
            statisticType: col.expr.name,
            onStatisticField: subjectField,
            outStatisticFieldName: col.as || fieldName.toLowerCase()
          })
        }
      }
    })
  }

  return outFields
}
