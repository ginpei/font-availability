const FontChecker = require('./FontChecker.js')

module.exports = {
	/**
	 * Font checkers created for each font family.
	 * @example
	 * const fontChecker = this.fontCheckers[fontFamily]
	 * console.log('Already tried?', Boolean(fontChecker))
	 */
	fontCheckers: {},

	/**
	 * Wait until the font is available.
	 * @param {string} fontFamily
	 * @returns {Promise}
	 */
	waitFor(fontFamily) {
		const fontChecker = this.getFontCheckerFor(fontFamily)
		return fontChecker.wait()
	},

	/**
	 * Returns singleton font checker for the font.
	 * @param {string} fontFamily
	 * @returns {FontChecker}
	 */
	getFontCheckerFor(fontFamily) {
		let fontChecker = this.fontCheckers[fontFamily]
		if (!fontChecker) {
			fontChecker = this.fontCheckers[fontFamily] = this.createNew(fontFamily)
		}
		return fontChecker
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
	 * Just check once.
	 * @param {string} fontFamily
	 * @returns {boolean}
	 */
	isAvailable(fontFamily) {
		const fontChecker = this.getFontCheckerFor(fontFamily)
		return fontChecker.isAvailable()
	},

	/**
	 * Remove font checkers created so far.
	 * @returns {object} Old font checkers.
	 */
	clear() {
		const old = this.fontCheckers
		this.fontCheckers = {}
		return old
	},
}
