const BaaS = require('./baas')
const HError = require('./HError')
const config = require('./config')
const polyfill = require('./polyfill')
const bugOut = require('./vendor/bugOut.v1.1.0.min')

let initialized = false

function enable({usePlugins = false} = {}) {
  initialized = true
  if (!BaaS._config || !BaaS._config.CLIENT_ID) {
    throw new HError(602)
  }
  // 插件版强制设置为 true
  bugOut.usePlugins = polyfill.SDK_TYPE === 'plugin' ? true : usePlugins
  return bugOut.init(true, BaaS._config.CLIENT_ID, config.VERSION)
}

function track(...args) {
  if (!initialized) {
    throw new HError(610)
  }
  return bugOut.track(...args)
}

function metaData(...args) {
  if (!initialized) {
    throw new HError(610)
  }

  return bugOut.metaData(...args)
}


module.exports = {
  enable, track, metaData
}