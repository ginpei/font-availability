const expect = require('chai').expect
const sinon = require('sinon')

const FontChecker = require('../lib/FontChecker.js')

describe('FontChecker', () => {
	let fontChecker

	beforeEach(() => {
		fontChecker = new FontChecker({ fontFamily: 'My Font' })
	})

	describe('constructor', () => {
		it('can be created', () => {
			expect(fontChecker).to.be.an.instanceof(FontChecker)
		})

		it('throws when fontFamily is not given', () => {
			expect(() => {
				fontChecker = new FontChecker()
			}).to.throw()
		})

		describe('with a string', () => {
			beforeEach(() => {
				fontChecker = new FontChecker('My Font')
			})

			it('sets the string fontFamily', () => {
				expect(fontChecker.fontFamily).to.equal('My Font')
			})
		})
	})

	describe('wait()', () => {
		let mock

		beforeEach(() => {
			mock = sinon.mock(fontChecker)
		})

		afterEach(() => {
			mock.restore()
		})

		it('starts only once', () => {
			mock.expects('startWaiting')
				.returns()
				.once()

			fontChecker.wait()
			fontChecker.wait()

			mock.verify()
		})

		it('returns always same value', () => {
			mock.expects('startWaiting')

			const result0 = fontChecker.wait()
			const result1 = fontChecker.wait()
			expect(result0).to.equal(result1)
		})
	})

	describe('callWithInterval()', () => {
		it('calls function until it returns false', done => {
			const callback = sinon.stub()
			callback.onCall(0).returns(undefined)
			callback.onCall(1).returns(undefined)
			callback.onCall(2).returns(false)
			callback.onCall(3).throws(new Error('Called more than expected'))
			fontChecker.callWithInterval(0, 0, callback)
			setTimeout(done, 100)
		})
	})

	describe('getNextInterval()', () => {
		it('returns just twice', () => {
			const result = fontChecker.getNextInterval(10, 21)
			expect(result).to.equal(20)
		})
		it('returns max', () => {
			const result = fontChecker.getNextInterval(11, 21)
			expect(result).to.equal(21)
		})
	})
})
