var Client = IgeClass.extend({
	classId: 'Client',

	init: function () {
		//ige.timeScale(0.1);
		//ige.showStats(1);

		// Load our textures
		var self = this;

		// Enable networking
		ige.addComponent(IgeNetIoComponent);
		
		// Implement client side network events
		this.implement(ClientNetworkEvents);

		// Create the HTML canvas
		ige.createFrontBuffer(true);

		// Load the textures we want to use
		this.textures = {
			ship: new IgeTexture('./assets/PlayerTexture.js'),
			rect: new IgeTexture('./assets/RectangleTexture.js'),
			bullet: new IgeTexture('./assets/BulletTexture.js'),
			specialSup: new IgeTexture('./assets/SpecialSupplierTexture.js'),
			defaultSpecial: new IgeTexture('./assets/DefaultSpecialSprite.js'),
			shield: new IgeTexture('./assets/specials/ShieldTexture.js')
		};

		ige.on('texturesLoaded', function () {
			// Ask the engine to start
			ige.start(function (success) {
				// Check if the engine started successfully
				if (success) {
					// Start the networking (you can do this elsewhere if it
					// makes sense to connect to the server later on rather
					// than before the scene etc are created... maybe you want
					// a splash screen or a menu first? Then connect after you've
					// got a username or something?
					ige.network.start('http://' + document.domain + ':2000', function () {
						
						// Setup the network command listeners
						ige.network.define('playerEntity', self._onPlayerEntity); // Defined in ./gameClasses/ClientNetworkEvents.js
						
						// Setup the network stream handler
						ige.network.addComponent(IgeStreamComponent)
							.stream.renderLatency(80) // Render the simulation 160 milliseconds in the past
							// Create a listener that will fire whenever an entity
							// is created because of the incoming stream data
							.stream.on('entityCreated', function (entity) {
								self.log('Stream entity created with ID: ' + entity.id());
								if (entity.id() === 'world') {
									self.world = entity;
									self.world.mount(self.mainScene);
									self.world.shouldRender(false);
								}
							});

						self.mainScene = new IgeScene2d()
							.id('mainScene')
							.width(1024)
							.height(800);


						self.hudScene = new HUDScreen()
							.id('hudScene')
							.mount(self.mainScene);
						self.hudScene.shouldRender(false);

						self.uiScene = new StartScreen()
							.id('startScreen')
							.mount(self.mainScene);

						self.vp1 = new IgeViewport()
							.id('vp1')
							.autoSize(true)
							.scene(self.mainScene)
							.drawBounds(false)
							.mount(ige);
						
						self.uiScene.on(StartScreen.EventType.SET_NAME, function(name) {
							self.nickname = name;
							self.uiScene.shouldRender(false);
							self.hudScene.nickname(self.nickname);
							self.hudScene.shouldRender(true);
							self.world.ignoreCamera(false);
							self.world.shouldRender(true);
							
							// Ask the server to create an entity for us
							ige.network.send('playerEntity', self.nickname);
						});
						
						// Define our player controls
						ige.input.mapAction('left', ige.input.key.left);
						ige.input.mapAction('right', ige.input.key.right);
						ige.input.mapAction('thrust', ige.input.key.up);
						ige.input.mapAction('fire1', ige.input.key.space);
						ige.input.mapAction('fire2', ige.input.key.f);
						// Set the contact listener methods to detect when
						// contacts (collisions) begin and end
						
						ige.addComponent(IgeEditorComponent);
					});
				}
			});
		});
	}
});

if (typeof(module) !== 'undefined' && typeof(module.exports) !== 'undefined') { module.exports = Client; }