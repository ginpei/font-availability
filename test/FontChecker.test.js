const expect = require('chai').expect
const sinon = require('sinon')

const FontChecker = require('../lib/FontChecker.js')

describe('FontChecker', () => {
	let fontChecker
	let mock

	beforeEach(() => {
		fontChecker = new FontChecker({ fontFamily: 'My Font' })
		mock = sinon.mock(fontChecker)
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

	describe('isAvailable()', () => {
		it('returns true if both are same but not empty', () => {
			mock.expects('capture')
				.withArgs('My Font', 'serif')
				.returns([1, 2, 3])
			mock.expects('capture')
				.withArgs('My Font', 'sans-serif')
				.returns([1, 2, 3])

			const result = fontChecker.isAvailable('My Font')
			expect(result).to.equal(true)
		})

		it('returns false if both are empty', () => {
			mock.expects('capture')
				.withArgs('My Font', 'serif')
				.returns([0, 0, 0])
			mock.expects('capture')
				.withArgs('My Font', 'sans-serif')
				.returns([0, 0, 0])

			const result = fontChecker.isAvailable('My Font')
			expect(result).to.equal(false)
		})

		it('returns false if both are not same', () => {
			mock.expects('capture')
				.withArgs('My Font', 'serif')
				.returns([1, 2, 3])
			mock.expects('capture')
				.withArgs('My Font', 'sans-serif')
				.returns([2, 3, 4])

			const result = fontChecker.isAvailable('My Font')
			expect(result).to.equal(false)
		})
	})
})
