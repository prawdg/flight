var Rectangle = IgeEntityBox2d.extend({
	classId: 'Rectangle',

	init: function () {
		IgeEntityBox2d.prototype.init.call(this);

		var self = this;

		if (ige.isClient) {
			// Define the texture this entity will use
			self.texture(ige.client.textures.rect);
		}
	}
});

if (typeof(module) !== 'undefined' && typeof(module.exports) !== 'undefined') { module.exports = Rectangle; }