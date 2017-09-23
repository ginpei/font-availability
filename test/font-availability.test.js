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

	describe('getFontCheckerFor()', () => {
		it('start a new session for a new font', () => {
			const spy = sinon.spy()
			mock.expects('createNew')
				.withArgs('MyFont')
				.once()

			fontAvailability.getFontCheckerFor('MyFont')

			mock.verify()
		})

		it('reuse an existing session for a font called before', () => {
			mock.expects('createNew')
				.withArgs('MyFont')
				.returns({})

			const result0 = fontAvailability.getFontCheckerFor('MyFont')
			const result1 = fontAvailability.getFontCheckerFor('MyFont')

			expect(result0).to.equal(result1)
		})
	})

	describe('isAvailable()', () => {
		it('calls the method', () => {
			const spy = sinon.spy()
			mock.expects('createNew')
				.withArgs('MyFont')
				.returns({ isAvailable: spy })

			fontAvailability.isAvailable('MyFont')

			expect(spy.called).to.equal(true)
		})
	})
})
