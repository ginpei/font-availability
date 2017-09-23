const FontChecker = require('./FontChecker.js')

module.exports = {
	/**
	 * Promises created for each font family.
	 * @example
	 * const fontFamily = 'My Font'
	 * const p = fontAvailability.promises[fontFamily]
	 * console.log('Already tried?', Boolean(p))
	 */
	promises: {},

	/**
	 * Wait until the font is available.
	 * @param {string} fontFamily
	 * @returns {Promise}
	 */
	waitFor(fontFamily) {
		let promise = this.promises[fontFamily]
		if (!promise) {
			const fontChecker = this.createNew(fontFamily)
			promise = this.promises[fontFamily] = fontChecker.wait()
		}
		return promise
	},

	/**
	 * Create a new session.
	 * @param {string} fontFamily
	 * @returns {FontChecker}
	 */
	createNew(fontFamily) {
		const fontChecker = new FontChecker(fontFamily)
		return fontChecker
	},

	/**
	 * Remove promises created so far.
	 * @returns {object} Old promises.
	 */
	clear() {
		const old = this.promises
		this.promises = {}
		return old
	},
}
