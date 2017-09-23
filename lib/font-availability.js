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
		let fontChecker = this.promises[fontFamily]
		if (!fontChecker) {
			fontChecker = this.promises[fontFamily] = this.createNew()
		}
		return fontChecker.waitFor(fontFamily)
	},

	/**
	 * Create a new session.
	 * @returns {FontChecker}
	 */
	createNew() {
		const fontChecker = new FontChecker()
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
