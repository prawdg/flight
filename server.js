var Server = IgeClass.extend({
	classId: 'Server',
	Server: true,

	init: function (options) {
		var self = this;
		
		this.implement(ServerNetworkEvents);
		
		// Add physics and setup physics world
		ige.addComponent(IgeBox2dComponent)
			.box2d.sleep(true)
			.box2d.gravity(0, 0)
			.box2d.createWorld()
			.box2d.mode(0)
			.box2d.start();
		
		this.players = {};

		// Add the networking component
		ige.addComponent(IgeNetIoComponent)
			// Start the network server
			.network.start(2000, function () {
				// Networking has started so start the game engine
				ige.start(function (success) {
					// Check if the engine started successfully
					if (success) {
						// Create some network commands we will need
						ige.network.define('playerEntity', self._onPlayerEntity);

						ige.network.define('playerControlLeftDown', self._onPlayerLeftDown);
						ige.network.define('playerControlRightDown', self._onPlayerRightDown);
						ige.network.define('playerControlThrustDown', self._onPlayerThrustDown);
						ige.network.define('playerControlFire1Down', self._onPlayerFire1Down);
						ige.network.define('playerControlFire2Down', self._onPlayerFire2Down);

						ige.network.define('playerControlLeftUp', self._onPlayerLeftUp);
						ige.network.define('playerControlRightUp', self._onPlayerRightUp);
						ige.network.define('playerControlThrustUp', self._onPlayerThrustUp);
						ige.network.define('playerControlFire1Up', self._onPlayerFire1Up);
						ige.network.define('playerControlFire2Up', self._onPlayerFire2Up);

						ige.network.on('connect', self._onPlayerConnect); // Defined in ./gameClasses/ServerNetworkEvents.js
						ige.network.on('disconnect', self._onPlayerDisconnect); // Defined in ./gameClasses/ServerNetworkEvents.js

						// Add the network stream component
						ige.network.addComponent(IgeStreamComponent)
							.stream.sendInterval(30) // Send a stream update once every 30 milliseconds
							.stream.start(); // Start the stream

						// Accept incoming network connections
						ige.network.acceptConnections(true);

						self.mainScene = new IgeScene2d()
							.id('mainScene')
							.width(1024)
							.height(642);

						self.world = new World()
							.id('world')
							.streamMode(1)
							.mount(self.mainScene);

						self.vp1 = new IgeViewport()
							.id('vp1')
							.autoSize(true)
							.scene(self.mainScene)
							.drawBounds(false)
							.mount(ige);

						ige.box2d.contactListener(
							// Listen for when contact's begin
							function (contact) {
								if(contact.igeEntityA().isHidden() || contact.igeEntityB().isHidden()) {
									contact.SetEnabled(false);
									return;
								}

								if (contact.igeBothCategories('bullet')) {
									var bullet1 = contact.igeEntityA();
									var bullet2 = contact.igeEntityB();
									bullet1.destroy();
									bullet2.destroy();
									return;
								} else if (contact.igeEitherCategory('bullet')) {
									var bullet = contact.igeEntityByCategory('bullet');
									bullet.destroy();
								}

								if (contact.igeBothCategories('special_sprite')) {
									contact.igeEntityA().destroy();
									contact.igeEntityB().destroy();
									return;
								}
								
								if (contact.igeEitherCategory('special_sprite', 'player')) {
									var specialSprite = contact.igeEntityByCategory('special_sprite');
									var special = specialSprite.special();
									var player = contact.igeEntityByCategory('player');
									player.addSpecial(special);
									special.owner(player);
									specialSprite.destroy();
									return;
								}

							}, undefined,

							function(contact) {
								if(contact.igeEntityA().isHidden() || contact.igeEntityB().isHidden()) {
									contact.SetEnabled(false);
								}
							},

							function (contact, impulse) {
								if (contact.igeEitherCategory('bullet', 'player')) {
									var bullet = contact.igeEntityByCategory('bullet');
									var player = contact.igeEntityByCategory('player');
									if (player != bullet.player) {
										var normalImpulse = parseInt(impulse.normalImpulses[0] * 100) / 100.0;
										var tangentImpulse = parseInt(impulse.tangentImpulses[0] * 100) / 100.0;
										var damage = Math.sqrt(Math.pow(normalImpulse, 2)
											+ Math.pow(tangentImpulse, 2));
										damage = parseInt(damage * 100) / 100.0;
										var destroyed = player.takeDamage(damage);
										console.log(bullet.player.nickname() + ' dealt ' + damage
											+ ' damage to ' + player.nickname());
										if (destroyed) {
											console.log(player.nickname() + ' destroyed by ' +
												bullet.player.nickname() + ' with a fatal ' + damage + ' damage')
											bullet.player.score(bullet.player.score() + 100);
											player.respawn();
										}
									}
								}
							}
						);
					}
				});
			});
	}
});

if (typeof(module) !== 'undefined' && typeof(module.exports) !== 'undefined') { module.exports = Server; }