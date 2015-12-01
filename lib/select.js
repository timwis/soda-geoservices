var _ = {
  find: require('lodash/collection/find')
}

var aggregationFunctions = ['count', 'sum', 'avg', 'stddev', 'var', 'min', 'max']

// Helper function to test whether set of columns contains a particular function
var hasFunction = function (columns, functionName) {
  return _.find(columns, function (column) {
    return column.expr.type === 'aggr_func' && column.expr.name.toLowerCase() === functionName
  })
}

module.exports = function (columns, query) {
  var outFields = columns // if columns is '*', keep it that way

  if (columns instanceof Array) {
    outFields = [] // recast as array

    columns.forEach(function (col, index) {
      if (col.expr.type === 'column_ref') {
        // basic column selection
        outFields.push(col.expr.column)
      } else if (col.expr.type === 'aggr_func') {
        // functions
        var func_name = col.expr.name.toLowerCase()

        if (func_name === 'count' && hasFunction(columns, 'extent')) {
          // count() when extent() is present in selection
          query.returnCountOnly = true
        } else if (aggregationFunctions.indexOf(func_name) !== -1) {
          // aggregation
          var subjectField = col.expr.args.expr.type === 'star' ? 'OBJECTID' : col.expr.args.expr.column
          var fieldName = col.expr.name + (col.expr.args.expr.type === 'star' ? '' : '_' + col.expr.args.expr.column)

          query.outStatistics.push({
            statisticType: col.expr.name,
            onStatisticField: subjectField,
            outStatisticFieldName: col.as || fieldName.toLowerCase()
          })
        } else if (func_name === 'extent') {
          // extent()
          query.returnExtentOnly = true
          delete columns[index]
        }
      }
    })
  }

  return outFields
}
