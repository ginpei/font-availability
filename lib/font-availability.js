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
		return FontChecker.waitFor(fontFamily)
	},
}
