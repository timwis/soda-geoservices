var empty = {
  'type': 'binary_expr',
  operator: '=',
  left: {
    'type': 'number',
    'value': 1
  },
  right: {
    'type': 'number',
    'value': 1
  }
}

module.exports = function (expr, query) {
  // If AND or OR, recurse
  if (expr.type === 'binary_expr' && (expr.operator === 'AND' || expr.operator === 'OR')) {
    expr.left = module.exports(expr.left, query)
    expr.right = module.exports(expr.right, query)
  } else if (expr.type === 'function') {
    // within_box
    if (expr.name === 'within_box') {
      query.geometryType = 'esriGeometryEnvelope'
      query.geometry = [
        expr.args.value[2].value, // lng / x (0 is field name)
        expr.args.value[1].value, // lat / y
        expr.args.value[4].value, // lng / x
        expr.args.value[3].value  // lng / y
      ]
      expr = empty
    } else if (expr.name === 'within_circle') {
      // within_circle
      query.geometry = [
        expr.args.value[2].value, // lng / x (0 is field name)
        expr.args.value[1].value  // lat / y
      ]
      query.distance = expr.args.value[3].value
      expr = empty
    }
  }
  return expr
}
