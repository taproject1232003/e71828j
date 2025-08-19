const BaaS = require('./baas')
const config = require('./config')
const constants = require('./constants')
const extend = require('node.extend')
const Promise = require('./promise')
const request = require('./request')
const utils = require('./utils')
const user = require('./user')


/**
 * BaaS 网络请求，此方法能保证在已登录 BaaS 后再发起请求
 */
const baasRequest = function ({ url, method = 'GET', data = {}, header = {}, dataType = 'json' }) {
  return user.login(false).then(() => {
    return request.apply(null, arguments)
  }, (err) => {
    throw new Error(err)
  })
}


/**
 * 根据 methodMap 创建对应的 BaaS Method
 * @param  {Object} methodMap 按照指定格式配置好的方法配置映射表
 */
const doCreateRequestMethod = (methodMap) => {
  const HTTPMethodCodeMap = {
    GET: constants.STATUS_CODE.SUCCESS,
    POST: constants.STATUS_CODE.CREATED,
    PUT: constants.STATUS_CODE.UPDATE,
    PATCH: constants.STATUS_CODE.PATCH,
    DELETE: constants.STATUS_CODE.DELETE
  }

  for (let k in methodMap) {
    if (methodMap.hasOwnProperty(k)) {
      BaaS[k] = ((k) => {
        let methodItem = methodMap[k]
        return (objects) => {
          let newObjects = extend(true, {}, objects)
          let method = methodItem.method || 'GET'

          if (methodItem.defaultParams) {
            let defaultParamsCopy = extend({}, methodItem.defaultParams)
            newObjects = extend(defaultParamsCopy, newObjects)
          }

          let url = utils.format(methodItem.url, newObjects)
          let data = (newObjects && newObjects.data) || newObjects
          data = excludeParams(methodItem.url, data)
          data = replaceQueryParams(data)

          return new Promise((resolve, reject) => {
            return baasRequest({ url, method, data }).then((res) => {
              if (res.statusCode == HTTPMethodCodeMap[method]) {
                resolve(res)
              } else {
                reject(constants.MSG.STATUS_CODE_ERROR)
              }
            }, (err) => {
              reject(err)
            })
          })
        }
      })(k)
    }
  }
}

/**
 * 把 URL 中的参数占位替换为真实数据，同时将这些数据从 params 中移除， params 的剩余参数传给 data eg. xxx/:tabelID/xxx => xxx/1001/xxx
 * @param  {Object} params 参数对象, 包含传给 url 的参数，也包含传给 data 的参数
 */
const excludeParams = (URL, params) => {
  URL.replace(/:(\w*)/g, (match, m1) => {
    if (params[m1] !== undefined) {
      delete params[m1]
    }
  })
  return params
}

/**
 * 将查询参数 (?categoryID=xxx) 替换为服务端可接受的格式 (?category_id=xxx) eg.categoryID => category_id
 */
const replaceQueryParams = (params = {}) => {
  let requestParamsMap = config.REQUEST_PARAMS_MAP
  let copiedParams = extend({}, params)

  Object.keys(params).map(key => {
    Object.keys(requestParamsMap).map(mapKey => {
      if (key.startsWith(mapKey)) {
        var newKey = key.replace(mapKey, requestParamsMap[mapKey])
        delete copiedParams[key]
        copiedParams[newKey] = params[key]
      }
    })
  })

  return copiedParams
}

/**
 * 遍历 METHOD_MAP_LIST，对每个 methodMap 调用 doCreateRequestMethod(methodMap)
 */
const createRequestMethod = () => {
  let methodMapList = BaaS._config.METHOD_MAP_LIST
  methodMapList.map((v) => {
    doCreateRequestMethod(v)
  })
}


module.exports = {
  baasRequest,
  excludeParams,
  replaceQueryParams,
  createRequestMethod,
  doCreateRequestMethod
}
