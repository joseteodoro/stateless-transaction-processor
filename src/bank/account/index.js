const { formatError } = require('../../util')
const middlewares = require('../../middlewares')

const doNotExists = ({account = {}, newAccount}, next) => {
  return Object.keys(account).length > 0
    ? formatError({account}, 'account-already-initialized')
    : next({account: newAccount})
}

const create = ({account}, next) => {
  return next({account: {...account, history: []}})
}

const newAccount = middlewares(
  doNotExists,
  create
)

module.exports = { newAccount }