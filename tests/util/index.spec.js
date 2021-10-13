const { format, formatError, hasError } = require('../../src/util')

describe('src/util suite', () => {
    describe('when formating the data', () => {
        it('should format the content properly', () => {
            const account = {"active-card": true, "available-limit": 1000, history: []}
            expect(format(account)).to.be.deep.equal({
                account: {
                    'active-card': true,
                    'available-limit': 1000
                },
                violations: []
            })
        })
        it('should format the error properly', () => {
            const account = {"active-card": true, "available-limit": 1000, history: []}
            const violations = 'v1'
            expect(formatError({account}, violations)).to.be.deep.equal({
                account: {
                    'active-card': true,
                    'available-limit': 1000
                },
                violations: ['v1']
            })
        })
    })
    describe('when validating if we have an error', () => {
        it('should return that we have an error', () => {
            const data = {
                account: {
                    'active-card': true,
                    'available-limit': 1000
                },
                violations: ['v1']
            }
            expect(hasError(data)).to.be.true
        })
        it('when violations is empty array, should return that we have no errors', () => {
            const data = {
                account: {
                    'active-card': true,
                    'available-limit': 1000
                },
                violations: []
            }
            expect(hasError(data)).to.be.false
        })
        it('when violations doesnt exists, should return that we have no errors', () => {
            const data = {
                account: {
                    'active-card': true,
                    'available-limit': 1000
                },
                violations: []
            }
            expect(hasError(data)).to.be.false
        })
    })
})
