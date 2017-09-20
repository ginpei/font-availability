module.exports = class FontChecker {
	/**
	 * Constructor.
	 * @param {class} [options.Promise]
	 */
	constructor(options = {}) {
		this.Promise = options.Promise
	}

	/**
	 * Wait until the font is available.
	 * @param {string} fontFamily
	 * @returns {Promise}
	 */
	waitFor(fontFamily) {
		return this.promise((resolve, reject) => {
			const maxInterval = 3000
			const startInterval = 200
			this.callWithInterval(startInterval, maxInterval, timerId => {
				if (this.isAvailable(fontFamily)) {
					return false
				}
			})
		})
	}

	/**
	 * Invoke new promise.
	 * If fallback is set, use it.
	 * @returns {Promise}
	 */
	promise(callback) {
		if (this.Promise) {
			return new this.Promise(callback)
		} else {
			return new Promise(callback)
		}
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
			if (result !== false) {
				interval = this.getNextInterval(interval, maxInterval)
			}
			else {
				clearTimeout(timerId)
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
		// WIP
		return false
	}
}
