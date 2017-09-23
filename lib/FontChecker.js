/**
 * @class
 * @example
 * const fontChecker = new FontChecker('My Great Font')
 * fontChecker.wait()
 *   .then(_ => console.log('Ready!'))
 */
module.exports = class FontChecker {
	/**
	 * Constructor.
	 * You can give a font family as a string instead of an option object.
	 * @param {string} options.fontFamily Required.
	 */
	constructor(options = {}) {
		if (typeof options === 'string') {
			options = {
				fontFamily: options,
			}
		}

		this.fontFamily = options.fontFamily
		if (!this.fontFamily) {
			throw new Error('`options.fontFamily is required.')
		}
	}

	/**
	 * Wait until the font is available.
	 * Even when you can call this more than once,
	 * all of returned values are same promise object.
	 * @returns {Promise}
	 */
	wait() {
		if (!this.promise) {
			this.promise = new Promise((resolve, reject) => this.startWaiting(resolve, reject))
		}

		return this.promise
	}

	/**
	 * Wait until the font is available.
	 * @param {function} resolve Given by Promise.
	 * @param {function} reject Given by Promise.
	 */
	startWaiting(resolve, reject) {
		const maxInterval = 3000
		const startInterval = 200
		this.callWithInterval(startInterval, maxInterval, timerId => {
			if (this.isAvailable(this.fontFamily)) {
				resolve()
				return false
			}
		})
	}

	/**
	 * Call the specified function lengthening interval.
	 * @param {number} startInterval
	 * @param {number} maxInterval
	 * @param {function} callback Called with next timer ID.
	 */
	callWithInterval(startInterval, maxInterval, callback) {
		let interval = startInterval
		const f = _ => {
			const timerId = setTimeout(f, interval)
			const result = callback(timerId)
			if (result === false) {
				clearTimeout(timerId)
			}
			else {
				interval = this.getNextInterval(interval, maxInterval)
			}
		}
		f()
	}

	/**
	 * @param {number} startInterval
	 * @param {number} maxInterval
	 */
	getNextInterval(interval, maxInterval) {
		return Math.min(interval * 2, maxInterval)
	}

	/**
	 * @param {string} fontFamily The name of font family.
	 * @returns {boolean}
	 */
	isAvailable(fontFamily) {
		const capture1 = this.capture(fontFamily, 'serif')
		const capture2 = this.capture(fontFamily, 'sans-serif')

		var empty = capture1.every(v => v === 0)
		if (empty) {
			return false
		}

		var same = capture1.every((v, i) => v === capture2[i])
		return same
	}

	/**
	 * Create a capture of canvas using the font.
	 * @param {string} fontFamily The target font family.
	 * @param {string} sobFont Fallback font family keyword. e.g. "serif"
	 * @returns {Uint8ClampedArray}
	 * @see https://developer.mozilla.org/en-US/docs/Web/API/ImageData/data
	 */
	capture(targetFont, genericFont) {
		var canvas = document.createElement('canvas')
		canvas.width = 100
		canvas.height = 30

		var ctx = canvas.getContext('2d')
		ctx.font = `20px/20px ${targetFont}, ${genericFont}`
		ctx.fillText('silver fox', 0, 22)

		var imageData = ctx.getImageData(0, 0, canvas.width, canvas.height)
		var capture = imageData.data

		// consider IE
		if (!capture.every) {
			capture.every = Array.prototype.every
		}

		return capture
	}
}
