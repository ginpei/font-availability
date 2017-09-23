if (typeof Uint8ClampedArray === 'function' && !Uint8ClampedArray.prototype.every) {
	implementEvery(Uint8ClampedArray.prototype)
}
else if (typeof CanvasPixelArray === 'function' && !CanvasPixelArray.prototype.every) {
	implementEvery(CanvasPixelArray.prototype)
}

function implementEvery(prototype) {
	prototype.every = function(callback) {
		var all = true
		for (var i = 0; i < this.length; ++i) {
			all = callback(this[i], i)
			if (!all) {
				break
			}
		}
		return all
	}
}
