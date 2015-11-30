module.exports = function (columns) {
  return columns instanceof Array
    ? columns.map(function (column) {
      return column.expr.column
    })
    : '*'
}
