/**
 * @class
 * @example
 * const fontChecker = new FontChecker()
 * fontChecker.waitFor('My Great Font')
 *   .then(_ => console.log('Ready!'))
 */
module.exports = class FontChecker {
	// /**
	//  * Constructor.
	//  */
	// constructor(options = {}) {
	// }

	/**
	 * Wait until the font is available.
	 * @param {string} fontFamily
	 * @returns {Promise}
	 */
	waitFor(fontFamily) {
		return new Promise((resolve, reject) => {
			const maxInterval = 3000
			const startInterval = 200
			this.callWithInterval(startInterval, maxInterval, timerId => {
				if (this.isAvailable(fontFamily)) {
					resolve()
					return false
				}
			})
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
