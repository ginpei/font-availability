const expect = require('chai').expect
const sinon = require('sinon')

const FontChecker = require('../lib/FontChecker.js')

describe('FontChecker', () => {
	let fontChecker

	beforeEach(() => {
		fontChecker = new FontChecker()
	})

	describe('Promise fallback', () => {
		let fontChecker

		it('uses fallback if set', done => {
			const spy = sinon.spy()
			class MyPromise {
				constructor(callback) {
					expect(callback).to.equal(spy)
					done()
				}
			}

			fontChecker = new FontChecker({ Promise: MyPromise })

			fontChecker.promise(spy)
		})

		it('uses default if not set', done => {
			fontChecker = new FontChecker()

			fontChecker.promise((resolve, reject) => {
				resolve()
			})
				.then(done)
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