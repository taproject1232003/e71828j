const BaaS = require('./baas')
const BaseQuery = require('./BaseQuery')
const UserRecord = require('./UserRecord')
const utils = require('./utils')
const HError = require('./HError')

/**
 * 用户
 * @memberof BaaS
 * @extends BaaS.BaseQuery
 * @public
 */
class User extends BaseQuery {
  constructor() {
    super()
  }

  /**
   * 获取用户详情。
   * @method
   * @param {string} userID 用户 ID
   * @return {Promise<any>}
   */
  get(userID) {
    let params = {userID}
    if (this._expand) {
      params.expand = this._expand
    }

    if (this._keys) {
      params.keys = this._keys
    }
    this._initQueryParams()
    return BaaS.getUserDetail(params)
  }

  /**
   * 获取一个用户记录（仅引用，非数据）。
   * @param {number} userID 用户 ID
   * @return {Promise<BaaS.UserRecord>}
   */
  getWithoutData(userID) {
    if (utils.isString(userID) || Number.isInteger(userID)) {
      return new UserRecord(userID)
    } else {
      throw new HError(605)
    }
  }

  /**
   * 获取当前用户记录（仅引用，非数据）。
   * @param {number} userID 用户 ID
   * @returns {BaaS.UserRecord}
   */
  getCurrentUserWithoutData() {
    return new UserRecord()
  }

  /**
   * 获取用户列表。
   * @method
   * @return {Promise<any>}
   */
  find() {
    let condition = this._handleAllQueryConditions()
    this._initQueryParams()
    return BaaS.getUserList(condition)
  }
}

module.exports = User
