var wkt = require('terraformer-wkt-parser')
var arcgis = require('terraformer-arcgis-parser')

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
    if (expr.name === 'within_box') {
      // within_box
      query.geometryType = 'esriGeometryEnvelope'
      query.geometry = [
        expr.args.value[2].value, // lng / x (0 is field name)
        expr.args.value[1].value, // lat / y
        expr.args.value[4].value, // lng / x
        expr.args.value[3].value  // lng / y
      ].join(', ')
      expr = empty
    } else if (expr.name === 'within_circle') {
      // within_circle
      query.geometryType = 'esriGeometryPoint'
      query.geometry = [
        expr.args.value[2].value, // lng / x (0 is field name)
        expr.args.value[1].value  // lat / y
      ].join(', ')
      query.distance = expr.args.value[3].value
      expr = empty
    } else if (expr.name === 'within_polygon') {
      // within_polygon
      query.geometryType = 'esriGeometryPolygon'
      try {
        query.geometry = JSON.stringify(arcgis.convert(wkt.parse(expr.args.value[1].value)))
      } catch (e) {
        console.error('Error converting polygon geometry')
      }
      expr = empty
    } else if (expr.name === 'starts_with') {
      // starts_with
      expr = {
        'type': 'binary_expr',
        operator: 'LIKE',
        left: {
          'type': 'column_ref',
          table: '',
          column: expr.args.value[0].column
        },
        right: {
          'type': 'string',
          'value': expr.args.value[1].value + '%'
        }
      }
    }
  }
  return expr
}
