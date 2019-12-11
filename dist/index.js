
'use strict'

if (process.env.NODE_ENV === 'production') {
  module.exports = require('./view.cjs.production.min.js')
} else {
  module.exports = require('./view.cjs.development.js')
}
