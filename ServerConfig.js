var config = {
	include: [
		//{name: 'MyClassName', path: './gameClasses/MyClassFileName'},
		{name: 'ServerNetworkEvents', path: './gameClasses/ServerNetworkEvents'},
		{name: 'CommonUtils', path: './utils/CommonUtils'},
		{name: 'ShapeUtils', path: './utils/ShapeUtils'},
		{name: 'Player', path: './gameClasses/Player'},
		{name: 'World', path: './gameClasses/World'},
		{name: 'Rectangle', path: './gameClasses/Rectangle'},
		{name: 'Bullet', path: './gameClasses/Bullet'},
		{name: 'AbstractSpecialSprite', path: './gameClasses/AbstractSpecialSprite'},
		{name: 'AbstractSpecial', path: './gameClasses/AbstractSpecial'},
		{name: 'Shield', path: './gameClasses/specials/Shield'},
		{name: 'SpecialSupplier', path: './gameClasses/SpecialSupplier'}
	]
};

if (typeof(module) !== 'undefined' && typeof(module.exports) !== 'undefined') { module.exports = config; }