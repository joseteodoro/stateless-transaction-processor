const { iterateOverActions } = require('../../src/bank')

describe('src/transaction suite', () => {
    context('when we already have an account', () => {
        it('when we do a simple spend, should works properly', () => {
            const actions = [
                {"account": {"active-card": true, "available-limit": 100, history: []}},
                {"transaction": {"merchant": "Habbib's", "amount": 90, "time": "2019-02-13T12:00:00.000Z"}},
            ]
            const result = iterateOverActions(actions)
            expect(result).to.be.deep.equal({
                account: {
                    'active-card': true,
                    'available-limit': 10
                },
                violations: []
            })
        })
        it('when we dont have enough limit, should return with error', () => {
            const actions = [
                {"account": {"active-card": true, "available-limit": 100, history: []}},
                {"transaction": {"merchant": "Habbib's", "amount": 120, "time": "2019-02-13T12:00:00.000Z"}},
            ]
            const result = iterateOverActions(actions)
            expect(result).to.be.deep.equal({
                account: {
                    'active-card': true,
                    'available-limit': 100
                },
                violations: ['insufficient-limit']
            })
        })
        it('when we do a simple spend but the card is not active, we should get an error', () => {
            const actions = [
                {"account": {"active-card": false, "available-limit": 100, history: []}},
                {"transaction": {"merchant": "Habbib's", "amount": 90, "time": "2019-02-13T12:00:00.000Z"}},
            ]
            const result = iterateOverActions(actions)
            expect(result).to.be.deep.equal({
                account: {
                    'active-card': false,
                    'available-limit': 100
                },
                violations: ['card-not-active']
            })
        })
        it('when we do a doubled spend, should return with error', () => {
            const actions = [
                {"account": {"active-card": true, "available-limit": 100, history: []}},
                {"transaction": {"merchant": "Habbib's", "amount": 20, "time": "2019-02-13T12:00:00.000Z"}},
                {"transaction": {"merchant": "Habbib's", "amount": 20, "time": "2019-02-13T12:00:00.000Z"}},
            ]
            const result = iterateOverActions(actions)
            expect(result).to.be.deep.equal({
                account: {
                    'active-card': true,
                    'available-limit': 80
                },
                violations: ['doubled-transaction']
            })
        })
        it('when we do the same merchant plus less then 2 minutes, should be considered as double spend', () => {
            const actions = [
                {"account": {"active-card": true, "available-limit": 100, history: []}},
                {"transaction": {"merchant": "Habbib's", "amount": 20, "time": "2019-02-13T12:00:00.000Z"}},
                {"transaction": {"merchant": "Habbib's", "amount": 20, "time": "2019-02-13T12:01:00.000Z"}},
            ]
            const result = iterateOverActions(actions)
            expect(result).to.be.deep.equal({
                account: {
                    'active-card': true,
                    'available-limit': 80
                },
                violations: ['doubled-transaction']
            })
        })
        it('when we have more than 3 transactions on 2 minutes, should be considered as high-frequency-small-interval', () => {
            const actions = [
                {"account": {"active-card": true, "available-limit": 100, history: []}},
                {"transaction": {"merchant": "Habbib's", "amount": 20, "time": "2019-02-13T12:01:00.000Z"}},
                {"transaction": {"merchant": "Mac Donald's", "amount": 20, "time": "2019-02-13T12:01:00.000Z"}},
                {"transaction": {"merchant": "Amazon", "amount": 20, "time": "2019-02-13T12:01:20.000Z"}},
                {"transaction": {"merchant": "Cocobamboo", "amount": 20, "time": "2019-02-13T12:01:30.000Z"}},
            ]
            const result = iterateOverActions(actions)
            expect(result).to.be.deep.equal({
                account: {
                    'active-card': true,
                    'available-limit': 40
                },
                violations: ['high-frequency-small-interval']
            })
        })
    })
})
