const R = require('ramda')

const clearIfNotVerbose = account => {
  return process.env.VERBOSE ? account : R.omit(['history'], account)
}

const format = (account = {}, violations = []) => {
  return {
    account: clearIfNotVerbose(account),
    violations
  }
}

const formatError = ({account}, error) => format(account, [error])

const hasError = ({violations}) => Array.isArray(violations) && violations.length > 0

module.exports = { format, formatError, hasError }
