const BaaS = require('./baas')
const constants = require('./constants')
const HError = require('./HError')
const utils = require('./utils')
const polyfill = require('./polyfill')
const storage = require('./storage')

/**
 *
 * @param {object} payload
 * @param resolve
 * @param reject
 */
function tryResendRequest(payload, resolve, reject) {
  let silentLogin = require('./auth').silentLogin

  // 此时的缓存一定是过期的
  if (storage.get(constants.STORAGE_KEY.UID)) {
    // 缓存被清空，silentLogin 一定会发起 session init 请求
    BaaS.clearSession()
  }

  silentLogin().then(() => {
    wx.request(
      Object.assign(payload,
        {
          header: setHeader(payload.header),
          success: resolve,
          fail: () => {
            utils.wxRequestFail(reject)
          }
        }))
  }, reject)
}


/**
 * 设置请求头
 * @param  {Object} header 自定义请求头
 * @return {Object}        扩展后的请求
 */
const builtInHeader = ['X-Hydrogen-Client-ID', 'X-Hydrogen-Client-Version', 'X-Hydrogen-Client-Platform', 'Authorization']

const setHeader = (header) => {
  let extendHeader = {
    'X-Hydrogen-Client-ID': BaaS._config.CLIENT_ID,
    'X-Hydrogen-Client-Version': BaaS._config.VERSION,
    'X-Hydrogen-Client-Platform': utils.getSysPlatform(),
    'X-Hydrogen-Client-SDK-Type': polyfill.SDK_TYPE,
  }

  let getAuthToken = BaaS.getAuthToken()
  if (getAuthToken) {
    extendHeader['Authorization'] = BaaS._config.AUTH_PREFIX + ' ' + getAuthToken
  }

  if (header) {
    builtInHeader.map(key => {
      if (header.hasOwnProperty(key)) {
        delete header[key]
      }
    })
  }

  return utils.extend(extendHeader, header || {})
}

const request = ({url, method = 'GET', data = {}, header = {}, dataType = 'json'}) => {
  return new Promise((resolve, reject) => {

    if (!BaaS._config.CLIENT_ID) {
      return reject(new HError(602))
    }

    let headers = setHeader(header)

    if (!/https?:\/\//.test(url)) {
      url = BaaS._config.API_HOST + url
    }

    wx.request({
      method: method,
      url: url,
      data: data,
      header: headers,
      dataType: dataType,
      success: res => {
        // 尝试重发请求
        if (res.statusCode == constants.STATUS_CODE.UNAUTHORIZED) {
          return tryResendRequest({header, method, url, data, dataType}, resolve, reject)
        }
        resolve(res)
      },
      fail: () => {
        utils.wxRequestFail(reject)
      }
    })

    utils.log('Request => ' + url)
  })
}

module.exports = request
