const R = require('ramda')
const moment = require('moment')
const { format, formatError, hasError } = require('../../util')
const middlewares = require('../../middlewares')

const highFrequencySmallInterval = (action, next) => {
  const { account: { history }, transaction: { time } } = action
  const threshold = moment(time).subtract(2, 'minutes')
  const transctionsFromThresold = history.filter(({at}) => at.isAfter(threshold))
  return transctionsFromThresold.length >= 3
    ? formatError(action, 'high-frequency-small-interval')
    : next(action)
}

const doubledTransaction = (action, next) => {
  const { account: { history }, transaction: { time, merchant: targetMerchant, amount: targetAmount } } = action
  const threshold = moment(time).subtract(2, 'minutes')
  const duplicates = history.filter(({amount, merchant, at}) => amount === targetAmount &&
    merchant === targetMerchant &&
    at.isAfter(threshold))
  return duplicates.length === 0
    ? next(action)
    : formatError(action, 'doubled-transaction')
}

const activeness = (action, next) => {
  return action.account['active-card']
    ? next(action)
    : formatError(action, 'card-not-active')
}

const exists = (action, next) => {
  return Object.keys(action.account || {}).length > 0
    ? next(action)
    : formatError({}, 'account-not-initialized')
}

const limit = (action, next) => {
    return action.account['available-limit'] < action.transaction.amount
    ? formatError(action, 'insufficient-limit')
    : next(action)
}

const fire = ({account, transaction}) => {
  return account['available-limit'] - transaction.amount
}

const byDate = ({time: l}, {time: r}) => {
  if (l < r) return -1
  if (l > r) return 1
  return 0
}

const fillMoment = transaction => {
  return {...transaction, at: moment(transaction.time)}
}

const history = ({account, transaction}) => {
  const { history = []} = account
  return {history: history.concat(fillMoment(transaction))
    .sort(byDate)}
}

const decrementLimit = (action, next) => {
    return next({
      account: {
        ...action.account,
        ...history(action),
        'available-limit': fire(action)
      }
    })
}

const transact = middlewares(
  exists,
  activeness,
  limit,
  highFrequencySmallInterval,
  doubledTransaction,
  decrementLimit
)

module.exports = { transact }