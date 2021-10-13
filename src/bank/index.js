const R = require('ramda')
const { newAccount: create } = require('./account')
const { transact } = require('./transaction')
const { hasError, format } = require('../util')

const businessRules = ({account}, { account: newAccount, transaction }) => newAccount
  ? create({ account, newAccount })
  : transact({ account, transaction })

const actionRunner = (accumulator, action) => {
    return hasError(accumulator)
      ? accumulator
      : businessRules(accumulator, action)
  }

const iterateOverActions = (actions = [] ) => {
  const { account, violations } = actions.reduce(actionRunner, {})
  return format(account, violations)
}

module.exports = { iterateOverActions }