const expect = require('chai').expect

const fontAvailability = require('../index.js')

describe('entry point', () => {
	it('exists', () => {
		expect(fontAvailability).not.equal(undefined)
	})
})
