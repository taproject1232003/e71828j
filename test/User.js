require('../src/baasRequest').createRequestMethod()
const config = require('../src/config')
const faker = require('faker')
const helper = require('./helper')
const Query = require('../src/Query')
const User = require('../src/User')
const UserRecord = require('../src/UserRecord')

const randomOption = config.RANDOM_OPTION

describe('User', () => {
  let user = null
  let randomNumber, randomString

  beforeEach(() => {
    user = new User()
  })

  before(() => {
    randomNumber = faker.random.number(randomOption)
    randomString = faker.lorem.words(1)
  })

  it('#get', () => {
    let getUserDetail = sinon.stub(BaaS, 'getUserDetail')
    getUserDetail.returnsPromise().resolves(randomString)
    user.get(1).then((res) => {
      expect(res).to.equal(randomString)
    })
    getUserDetail.restore()
  })

  it('#getWithoutData', () => {
    var someone = user.getWithoutData(randomNumber)
    expect(someone instanceof UserRecord).to.be.true
  })

  it('#_handleAllQueryConditions', () => {
    var query = new Query()
    query.compare('age', '>', randomNumber)
    user.setQuery(query)
    user.orderBy('-age')
    expect(user._handleAllQueryConditions()).to.deep.equal({
      limit: 20,
      offset: 0,
      order_by: '-age',
      where: `{"$and":[{"age":{"$gt":${randomNumber}}}]}`
    })
  })
})