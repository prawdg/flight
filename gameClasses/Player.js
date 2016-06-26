var Player = IgeEntityBox2d.extend({
	classId: 'Player',

	init: function (nickname) {
		IgeEntityBox2d.prototype.init.call(this);

		var self = this;

		// TODO: refactor global properties into separate class
		this.MAX_SPECIALS = 1;

		this.drawBounds(false);

		this._nickname = nickname;

		// Rotate to point upwards
		this.controls = {
			left: false,
			right: false,
			thrust: false,
			fire1: false,
			fire2: false
		};

		this.width(20);
		this.height(20);
		this.score(0);

		if (ige.isServer) {
			this.bullets = {};
			this.bulletId = 0;
			this.specials = [];
			this.specialId = 0;
			this.bulletType = Bullet;
			// this.bullet2Type = Bullet;
			this._createBox2dBody();
		}

		if (ige.isClient) {
			self.texture(ige.client.textures.ship);
		}

		this.category('player');

		// Define the data sections that will be included in the stream
		this.streamSections(['transform', 'score']);
	},

	_createBox2dBody: function () {
		// Define the polygon for collision
		var triangles,
			fixDefs,
			collisionPoly = new IgePoly2d()
				.addPoint(0, -this._bounds2d.y2)
				.addPoint(this._bounds2d.x2, this._bounds2d.y2)
				.addPoint(0, this._bounds2d.y2 - 5)
				.addPoint(-this._bounds2d.x2, this._bounds2d.y2);

		// Scale the polygon by the box2d scale ratio
		collisionPoly.divide(ige.box2d._scaleRatio);

		// Now convert this polygon into an array of triangles
		triangles = collisionPoly.triangulate();
		this.triangles = triangles;

		// Create an array of box2d fixture definitions
		// based on the triangles
		fixDefs = [];

		for (var i = 0; i < this.triangles.length; i++) {
			fixDefs.push({
				density: 1.0,
				friction: 1.0,
				restitution: 0.2,
				filter: {
					categoryBits: 0x0004,
					maskBits: 0xffff & ~0x0008
				},
				shape: {
					type: 'polygon',
					data: this.triangles[i]
				}
			});
		}

		// Setup the box2d physics properties
		this.box2dBody({
			type: 'dynamic',
			linearDamping: 0.5,
			angularDamping: 2,
			allowSleep: true,
			bullet: true,
			gravitic: true,
			fixedRotation: false,
			fixtures: fixDefs
		});
	},

	streamCreateData: function () {
		return this._nickname;
	},

	_renderEntity: function(ctx) {
		IgeEntity.prototype._renderEntity.call(this, ctx);
		ctx.font = '10px Verdana';
		ctx.fillStyle = 'white';
		ctx.fillText(this._nickname + ' ' + this._score, -this._bounds2d.x2 - 10, this._bounds2d.y2 + 15);
	},

	/**
	 * Override the default IgeEntity class streamSectionData() method
	 * so that we can check for the custom1 section and handle how we deal
	 * with it.
	 * @param {String} sectionId A string identifying the section to
	 * handle data get / set for.
	 * @param {*=} data If present, this is the data that has been sent
	 * from the server to the client for this entity.
	 * @return {*}
	 */
	streamSectionData: function (sectionId, data) {
		// Check if the section is one that we are handling
		if (sectionId === 'score') {
			// Check if the server sent us data, if not we are supposed
			// to return the data instead of set it
			if (data) {
				// We have been given new data!
				this._score = data;
			} else {
				// Return current data
				return this._score;
			}
		} else {
			// The section was not one that we handle here, so pass this
			// to the super-class streamSectionData() method - it handles
			// the "transform" section by itself
			return IgeEntity.prototype.streamSectionData.call(this, sectionId, data);
		}
	},

	/**
	 * Gets / sets score for player
	 * @param {String=} score
	 * @return {*} this when arguments are passed to allow method chaining,
	 * the player's score otherwise
	 */
	score: function (score) {
		if (score !== undefined) {
			this._score = score;
			return this;
		} else {
			return this._score;
		}
	},

	/**
	 * Gets / sets nickname for player
	 * @param {String=} nickname A nickname for the player
	 * @return {*} this when arguments are passed to allow method chaining,
	 * the player's nickname otherwise
	 */
	nickname: function (nickname) {
		if (nickname !== undefined) {
			this._nickname = nickname;
			return this;
		} else {
			return this._nickname;
		}
	},

	/**
	 * Called every frame by the engine when this entity is mounted to the
	 * scenegraph.
	 * @param ctx The canvas context to render to.
	 */
	tick: function (ctx) {
		/* CEXCLUDE */
		if (ige.isServer) {

			// var velX = this.velocity._velocity.x;
			// var velY = this.velocity._velocity.y;
			if (this.controls.left) {
				//this.rotateBy(0, 0, Math.radians(-0.15 * ige._tickDelta));
				this._box2dBody.ApplyTorque(-0.05);
			}

			if (this.controls.right) {
				// this.rotateBy(0, 0, Math.radians(0.15 * ige._tickDelta));
				this._box2dBody.ApplyTorque(0.05);
			}

			if (this.controls.thrust) {
				var direction = this._rotate.z + Math.radians(-90);
				this._box2dBody.ApplyForce(new ige.box2d.b2Vec2(
					Math.cos(direction) * 0.8,
					Math.sin(direction) * 0.8
				), this._box2dBody.GetWorldCenter());
			}

			if (this.controls.fire1) {
				this.fireBullet();
			}

			if (this.controls.fire2) {
				if (this.specials[0]) {
					this.specials[0].activate();
				}
			} else {
				if (this.specials[0]) {
					this.specials[0].deactivate();
				}
			}
		}
		/* CEXCLUDE */

		if (ige.isClient) {
			if (ige.input.actionState('left')) {
				if (!this.controls.left) {
					// Record the new state
					this.controls.left = true;

					// Tell the server about our control change
					ige.network.send('playerControlLeftDown');
				}
			} else {
				if (this.controls.left) {
					// Record the new state
					this.controls.left = false;

					// Tell the server about our control change
					ige.network.send('playerControlLeftUp');
				}
			}

			if (ige.input.actionState('right')) {
				if (!this.controls.right) {
					// Record the new state
					this.controls.right = true;

					// Tell the server about our control change
					ige.network.send('playerControlRightDown');
				}
			} else {
				if (this.controls.right) {
					// Record the new state
					this.controls.right = false;

					// Tell the server about our control change
					ige.network.send('playerControlRightUp');
				}
			}

			if (ige.input.actionState('thrust')) {
				if (!this.controls.thrust) {
					// Record the new state
					this.controls.thrust = true;

					// Tell the server about our control change
					ige.network.send('playerControlThrustDown');
				}
			} else {
				if (this.controls.thrust) {
					// Record the new state
					this.controls.thrust = false;

					// Tell the server about our control change
					ige.network.send('playerControlThrustUp');
				}
			}

			if (ige.input.actionState('fire1')) {
				if (!this.controls.fire1) {
					// Record the new state
					this.controls.fire1 = true;

					// Tell the server about our control change
					ige.network.send('playerControlFire1Down');
				}
			} else {
				if (this.controls.fire1) {
					// Record the new state
					this.controls.fire1 = false;

					// Tell the server about our control change
					ige.network.send('playerControlFire1Up');
				}
			}

			if (ige.input.actionState('fire2')) {
				if (!this.controls.fire2) {
					// Record the new state
					this.controls.fire2 = true;

					// Tell the server about our control change
					ige.network.send('playerControlFire2Down');
				}
			} else {
				if (this.controls.fire2) {
					// Record the new state
					this.controls.fire2 = false;

					// Tell the server about our control change
					ige.network.send('playerControlFire2Up');
				}
			}
		}

		// Call the IgeEntity (super-class) tick() method
		IgeEntity.prototype.tick.call(this, ctx);
	},

	fireBullet: function () {
		this._fireBullet.bind(this)();
	},

	_fireBullet: CommonUtils.debounce(function () {
		var bullet = new this.bulletType(this)
			.id(this.id() + '_b' + this.bulletId++)
			.streamMode(1)
			.mount(ige.server.mainScene)
			.translateTo(this._translate.x + 30 * Math.sin(this._rotate.z),
				this._translate.y - 30 * Math.cos(this._rotate.z), 0)
			.direction(this._rotate.z + Math.radians(-90));
		this.addBullet(bullet);
	}, 300),

	addBullet: function (bullet) {
		this.bullets[bullet.id()] = bullet;
	},

	addSpecial: function (special) {
		this.specials[this.specialId++] = special;
		this.specialId %= this.MAX_SPECIALS;
	},

	destroyBullet: function (bullet) {
		delete this.bullets[bullet.id()];
	},

	removeSpecial: function (special) {
		for (var i = 0; i < this.MAX_SPECIALS; i++) {
			if (special.id() == this.specials[i].id()) {
				delete this.specials[i];
				break;
			}
		}
	}
});

if (typeof(module) !== 'undefined' && typeof(module.exports) !== 'undefined') { module.exports = Player; }