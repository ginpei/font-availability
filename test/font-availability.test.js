const expect = require('chai').expect
const sinon = require('sinon')

const fontAvailability = require('../lib/font-availability.js')

describe('font-availability', () => {
	let mock

	beforeEach(() => {
		mock = sinon.mock(fontAvailability)
	})

	afterEach(() => {
		fontAvailability.clear()
		mock.restore()
	})

	describe('waitFor()', () => {
		it('start a new session for a new font', () => {
			const spy = sinon.spy()
			mock.expects('createNew')
				.returns({ waitFor: spy })
				.once()

			fontAvailability.waitFor('MyFont')

			expect(spy.withArgs('MyFont').calledOnce).to.equal(true)
			mock.verify()
		})

		it('reuse an existing session for a font called before', () => {
			const spy = sinon.spy()
			mock.expects('createNew')
				.returns({ waitFor: spy })
				.once()

			const result0 = fontAvailability.waitFor('MyFont')
			const result1 = fontAvailability.waitFor('MyFont')

			expect(result0).to.equal(result1)
			mock.verify()
		})
	})
})
