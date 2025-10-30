const BaaS = require('./baas')
const BaseRecord = require('./BaseRecord')
const baasRequest = require('./baasRequest').baasRequest
const constants = require('./constants')
const GeoPoint = require('./GeoPoint')
const GeoPolygon = require('./GeoPolygon')
const _cloneDeep = require('lodash.clonedeep')

const API = BaaS._config.API

class UserRecord extends BaseRecord {
  constructor(userID) {
    super(userID)
  }

  update() {
    var record = _cloneDeep(this._record)
    this._record = {}
    return BaaS.updateUser({data: record})
  }
}

module.exports = UserRecord