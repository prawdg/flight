var igeClientConfig = {
	include: [
		/* Your custom game JS scripts */
		//'./gameClasses/MyClassFile.js',
		'./gameClasses/StartScreen.js',
		'./gameClasses/ClientNetworkEvents.js',
		'./utils/CommonUtils.js',
		'./gameClasses/Player.js',
		'./gameClasses/HUDScreen.js',
		'./gameClasses/World.js',
		'./gameClasses/Rectangle.js',
		'./gameClasses/Bullet.js',
		'./gameClasses/SpecialSupplier.js',
		'./gameClasses/AbstractSpecialSprite.js',
		'./gameClasses/AbstractSpecial.js',
		'./gameClasses/specials/Shield.js',
		
		/* Standard game scripts */
		'./client.js',
		'./index.js'
	]
};

if (typeof(module) !== 'undefined' && typeof(module.exports) !== 'undefined') { module.exports = igeClientConfig; }