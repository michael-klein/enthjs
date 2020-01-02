
'use strict'

if (process.env.NODE_ENV === 'production') {
  module.exports = require('./enthjs.cjs.production.min.js')
} else {
  module.exports = require('./enthjs.cjs.development.js')
}
