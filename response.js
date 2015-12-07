var arcgis = require('terraformer-arcgis-parser')

module.exports = function (response) {
  var converted = []
  if (response.features) {
    converted = response.features.map(function (feature) {
      var attributes = feature.attributes
      if (feature.geometry) attributes.geometry = arcgis.parse(feature.geometry)
      return attributes
    })
  }
  return converted
}
