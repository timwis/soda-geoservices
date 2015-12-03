var terraformer = require('terraformer-arcgis-parser')

module.exports = function (response) {
  var converted = []
  if (response.features) {
    converted = response.features.map(function (feature) {
      var attributes = feature.attributes
      if (feature.geometry) attributes.geometry = terraformer.parse(feature.geometry)
      return attributes
    })
  }
  return converted
}
