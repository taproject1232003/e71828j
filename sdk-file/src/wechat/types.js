/**
 * 网络请求返回值
 * @typedef {object.<T>} Response<T>
 * @memberof BaaS
 * @property {object} header - HTTP Response Header
 * @property {T} data - 数据
 * @property {number} statusCode - HTTP 状态码
 */

/**
 * 支付参数
 * @typedef PaymentParams
 * @memberof BaaS
 * @property {string} merchandiseDescription 微信支付凭证-商品详情的内容
 * @property {number} totalCost 支付总额，单位：元
 * @property {string} [merchandiseSchemaID] 商品数据表 ID，可用于定位用户购买的物品
 * @property {string} [merchandiseRecordID] 商品数据行 ID，可用于定位用户购买的物品
 * @property {Object} [merchandiseSnapshot] 根据业务需求自定义的数据
 * @property {boolean} [profitSharing] 当前订单是否需要分账
 */

/**
 * @typedef OrderParams
 * @memberof BaaS
 * @property {string} transactionID 支付流水号
 */

/**
 * @typedef Subscription
 * @memberof BaaS
 * @property {string} template_id 模版 ID
 * @property {string} subscription_type 模版类型
 */

/**
 * @typedef SubscribeMessageOptions
 * @memberof BaaS
 * @property {BaaS.Subscription[]} subscription 订阅关系
 */
