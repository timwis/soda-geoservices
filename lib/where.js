module.exports = function (expr, query) {
  // If AND or OR, recurse
  if (expr.type === 'binary_expr' && (expr.operator === 'AND' || expr.operator === 'OR')) {
    expr.left = module.exports(expr.left, query)
    expr.right = module.exports(expr.right, query)
  } else if (expr.type === 'function') {
    // within_box
    if (expr.name === 'within_box') {
      expr.args.value.shift()  // no need to retain arg 0, the field name
      query.geometryType = 'esriGeometryEnvelope'
      query.geometry = [
        expr.args.value[1].value, // lng / x
        expr.args.value[0].value, // lat / y
        expr.args.value[3].value, // lng / x
        expr.args.value[2].value  // lng / y
      ]
    }
  }
  return expr
}
