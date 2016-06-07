var World = IgeScene2d.extend({
	classId: 'World',
	
	init: function() {
		IgeScene2d.prototype.init.call(this);

		this.wallWidth = 10;
		this.worldWidth = 1024;
		this.worldHeight = 642;

		this.worldBoundaryLeft = new Rectangle()
			.drawBounds(true)
			.width(this.wallWidth)
			.height(this.worldHeight)
			.translateTo(-this.worldWidth / 2,0,0)
			.id(this.id() + 'pel-world-left')
			.mount(this);
		this.worldBoundaryRight = new Rectangle()
			.drawBounds(true)
			.width(this.wallWidth)
			.height(this.worldHeight)
			.translateTo(this.worldWidth / 2,0,0)
			.id(this.id() + 'pel-world-right')
			.mount(this);
		this.worldBoundaryUp = new Rectangle()
			.drawBounds(true)
			.width(this.worldWidth)
			.height(this.wallWidth * 3)
			.translateTo(0,-this.worldHeight / 2,0)
			.id(this.id() + 'pel-world-up')
			.mount(this);
		this.worldBoundaryDown = new Rectangle()
			.drawBounds(true)
			.width(this.worldWidth)
			.height(this.wallWidth)
			.translateTo(0,this.worldHeight / 2,0)
			.id(this.id() + 'pel-world-down')
			.mount(this);

		if (ige.isServer) {
			this.worldBoundaryLeft
				.category('worldBoundary')
				.box2dBody({
					type: 'static',
					allowSleep: true,
					fixtures: [{
						density: 1.0,
						friction: 0.5,
						restitution: 0.2,
						shape: {
							type: 'rectangle'
						}
					}],
					userData: {impulseDirection: 0}
				})
				//.streamMode(1)
				;

			this.worldBoundaryRight
				.category('worldBoundary')
				.box2dBody({
					type: 'static',
					allowSleep: true,
					fixtures: [{
						density: 1.0,
						friction: 0.5,
						restitution: 0.2,
						shape: {
							type: 'rectangle'
						}
					}],
					userData: {impulseDirection: 180}
				})
				//.streamMode(1)
				;

			this.worldBoundaryUp
				.category('worldBoundary')
				.box2dBody({
					type: 'static',
					allowSleep: true,
					fixtures: [{
						density: 1.0,
						friction: 0.5,
						restitution: 0.2,
						shape: {
							type: 'rectangle'
						}
					}],
					userData: {impulseDirection: 90}
				})
				//.streamMode(1)
				;

			this.worldBoundaryDown
				.category('worldBoundary')
				.box2dBody({
					type: 'static',
					allowSleep: true,
					fixtures: [{
						density: 1.0,
						friction: 0.5,
						restitution: 0.2,
						shape: {
							type: 'rectangle'
						}
					}],
					userData: {impulseDirection: -90}
				})
				//.streamMode(1)
				;
			this.specialSupplier = new SpecialSupplier()
				.id(this.id() + 'spec_sup')
				.streamMode(1)
				.mount(this);
		}
	}
});

if (typeof(module) !== 'undefined' && typeof(module.exports) !== 'undefined') { module.exports = World; }