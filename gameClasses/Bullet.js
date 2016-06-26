var Bullet = IgeEntityBox2d.extend({
    classId: 'Bullet',

    init: function (player) {
        IgeEntityBox2d.prototype.init.call(this);

        var self = this;

        this.drawBounds(false);
        this.width(2);
        this.height(5);
        this.lifeSpan(3000);

        if (ige.isServer) {
            this.player = player;
            this._createBox2dBody();
            this._fired = false;
            this.setProperties();
        }

        if (ige.isClient) {
            self.texture(ige.client.textures.bullet);
        }

        this.category('bullet');
    },

    _createBox2dBody: function () {
        // Define the polygon for collision
        var w = this._bounds2d.x;
        var h = this._bounds2d.y;
        var triangles,
            fixDefs,
            collisionPoly = new IgePoly2d()
                .addPoint(-w, h)
                .addPoint(w, h)
                .addPoint(w, -h)
                .addPoint(-w, -h);

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
                density: 10.0,
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
            linearDamping: 0,
            angularDamping: 0.5,
            allowSleep: true,
            bullet: false,
            gravitic: true,
            fixedRotation: false,
            fixtures: fixDefs,
            inertiaScale: 100
        });
    },

    setProperties: function () {
        this._fireForce = 300;
    },

    direction: function (direction) {
        if (direction) {
            this._direction = direction;
            this.rotateTo(0, 0, direction + Math.radians(90));
            return this;
        }
        return this._direction;
    },

    /**
     * Called every frame by the engine when this entity is mounted to the
     * scenegraph.
     * @param ctx The canvas context to render to.
     */
    tick: function (ctx) {
        /* CEXCLUDE */
        if (ige.isServer) {
            if (!this._fired) {
                this._fire();
            }
            this.controlPath();
        }


        // Call the IgeEntity (super-class) tick() method
        IgeEntity.prototype.tick.call(this, ctx);
    },

    _fire: function () {
        this._box2dBody.ApplyForce(new ige.box2d.b2Vec2(
                this._fireForce * Math.cos(this._direction),
                this._fireForce * Math.sin(this._direction)),
            this._box2dBody.GetWorldCenter());
        this._fired = true;
    },

    destroy: function () {
        if (ige.isServer) {
            this.player.destroyBullet(this);
        }
        IgeEntityBox2d.prototype.destroy.call(this);
    },

    /**
     * Override this method to control path of bullet after its fired
     */
    controlPath: function () {
        return;
    }
});

if (typeof(module) !== 'undefined' && typeof(module.exports) !== 'undefined') { module.exports = Bullet; }