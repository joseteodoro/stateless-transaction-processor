const { iterateOverActions } = require('../../src/bank')

describe('src/bank suite', () => {
    context('when we have nothing', () => {
        it('when we pass empty array should return empty results', () => {
            const result = iterateOverActions([])
            expect(result).to.be.deep.equal({account: {}, violations: []})
        })
        it('when we pass nothing should return empty results', () => {
            const result = iterateOverActions()
            expect(result).to.be.deep.equal({account: {}, violations: []})
        })
    })
    context('when we have no account', () => {
        it(`when we have no account action but transactions, should fail`, () => {
            const actions = [
                {"transaction": {"merchant": "Habbib's", "amount": 900, "time": "2019-02-13T12:00:00.000Z"}},
            ]
            const result = iterateOverActions(actions)
            expect(result).to.be.deep.equal({
                account: {},
                violations: ['account-not-initialized']
            })
        })
        it('when we have an account action, should create a new account properly', () => {
            const actions = [{"account": {"active-card": true, "available-limit": 1000, history: []}}]
            const result = iterateOverActions(actions)
            expect(result).to.be.deep.equal({
                account: {
                    'active-card': true,
                    'available-limit': 1000
                },
                violations: []
            })
        })
        it(`when we have an account action plus transactions, should create a new
            account properly and evaluate the transactions`, () => {
            const actions = [
                {"account": {"active-card": true, "available-limit": 1000, history: []}},
                {"transaction": {"merchant": "Habbib's", "amount": 900, "time": "2019-02-13T12:00:00.000Z"}},
            ]
            const result = iterateOverActions(actions)
            expect(result).to.be.deep.equal({
                account: {
                    'active-card': true,
                    'available-limit': 100
                },
                violations: []
            })
        })
    })
    context('when we already have an account', () => {
        it('when we have an account action, should fail', () => {
            const actions = [
                {"account": {"active-card": true, "available-limit": 1000, history: []}},
                {"account": {"active-card": true, "available-limit": 1000, history: []}}
            ]
            const result = iterateOverActions(actions)
            expect(result).to.be.deep.equal({
                account: {
                    'active-card': true,
                    'available-limit': 1000
                },
                violations: ['account-already-initialized']
            })
        })
    })
})
