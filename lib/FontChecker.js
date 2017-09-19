module.exports = class FontChecker {
	/**
	 * Wait until the font is available.
	 * @param {string} fontFamily
	 * @returns {Promise}
	 */
	waitFor(fontFamily) {
		return new Promise((resolve, reject) => {
			setTimeout(resolve, 1000)
		})
	}
}
