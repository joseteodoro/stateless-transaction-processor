const middlewares = require('../../src/middlewares')
const sinon = require('sinon')

describe('src/middlewares suite', () => {
    let sandbox
    beforeEach(() => {
        sandbox = sinon.createSandbox()
    })
    afterEach(() => {
        sandbox.restore()
    })

    it('should run all the middlewares and return the Indentity', () => {
        const concatNames = (value, next) => next(`${value.firstName} ${value.lastName}`)
        const upper = (value, next) => next(value.toUpperCase())
        const endSentence = (value, next) => next(`${value}.`)
        const result = middlewares(concatNames, upper, endSentence)({firstName: 'John', lastName: 'Snow'})
        expect(result).to.be.deep.equal('JOHN SNOW.')
    })
    it('should isolate two chains', () => {
        const input = ({firstName: 'John', lastName: 'Snow'})

        const concatNames = (value, next) => next(`${value.firstName} ${value.lastName}`)
        const upper = (value, next) => next(value.toUpperCase())
        const endSentence = (value, next) => next(`${value}.`)
        const nameChain = middlewares(concatNames, upper, endSentence)
        
        const exec = (value, next) => next(value + 1)
        const write = (value, next) => next(value + 2)
        const read = (value, next) => next(value + 4)
        const permissionChain = middlewares(exec, write, read)
        
        expect(nameChain({firstName: 'John', lastName: 'Snow'})).to.be.deep.equal('JOHN SNOW.')
        expect(permissionChain(0)).to.be.deep.equal(7)
    })
})