var inspect = require('util').inspect

module.exports = function (data) {
  console.log(inspect(data, false, 10, true))
}
