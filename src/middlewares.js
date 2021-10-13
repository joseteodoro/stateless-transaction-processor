const reducer = (acc, fn) => {
  return action => fn(action, acc)
}

const identity = args => {
  return args
}

const middlewares = (...middlewares) => {
  return middlewares.reverse().reduce(reducer, identity)
}

module.exports = middlewares