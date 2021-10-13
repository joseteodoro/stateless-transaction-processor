

// const actions = [
//     {"account": {"active-card": true, "available-limit": 1000, history: []}},
//     {"transaction": {"merchant": "Habbib's", "amount": 90, "time": "2019-02-13T12:00:00.000Z"}},
//     // {"account": {"active-card": true, "available-limit": 350}}
//     {"transaction": {"merchant": "Burger King", "amount": 20, "time": "2019-02-13T10:01:00.000Z"}},
//     {"transaction": {"merchant": "Burger King", "amount": 20, "time": "2019-02-13T10:01:10.000Z"}},
//     {"transaction": {"merchant": "Burger King", "amount": 20, "time": "2019-02-13T10:06:30.000Z"}},
//     {"transaction": {"merchant": "Burger King", "amount": 20, "time": "2019-02-13T10:09:00.000Z"}},
//     // {"transaction": {"merchant": "Burger King", "amount": 20, "time": "2019-02-13T10:01:00.000Z"}},
//     // {"transaction": {"merchant": "Burger King", "amount": 20, "time": "2019-02-13T10:01:00.000Z"}},
//     {"transaction": {"merchant": "Mac Donnald's", "amount": 15, "time": "2019-02-13T11:00:00.000Z"}}
// ]

// console.log(actions.reduce(actionRunner, {}))
const fs = require('fs')
const { iterateOverActions } = require('./bank')

if (process.argv[2] === '--help' || process.argv[2] === '-h') {
  console.log(`Here it's an example how to call the app,
  'cat myfile.txt | node src/index.js`)
  process.exit(0)
}

if (process.argv[2] === '--verbose' || process.argv[2] === '-v') {
  console.log(`Acting in a verbose mode.`)
  process.env.VERBOSE = true
}

const empty = content => !!content

// magic line to read the input from the stream
const streamContent = fs.readFileSync(0).toString()
const actions = streamContent.split('\n')
  .filter(empty)
  .map(JSON.parse)

if (!Array.isArray(actions) || actions.length === 0 ) {
  console.log(`There is no action to be executed. Here it's an example how to call the app,
  'node src/index.js < tests/sample.txt`)
  process.exit(0)
}

console.log(require('util').inspect(iterateOverActions(actions), {depth: null}))
