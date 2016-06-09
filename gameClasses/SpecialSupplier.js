var SpecialSupplier = IgeEntityBox2d.extend({
    classId: 'SpecialSupplier',

    init: function () {
        IgeEntityBox2d.prototype.init.call(this);

        this.width(40).height(40);

        if (ige.isClient) {
            this.texture(ige.client.textures.special);
        }

        if (ige.isServer) {
            this.specials = [];
            this._createBox2dBody();
        }
    },

    _createBox2dBody: function () {
        var triangles,
            fixDefs,
            collisionPoly = ShapeUtils.createCShape(0, 0,
                this.width() / 2, 3 * Math.PI / 4, Math.PI / 4, 16, 5);

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
            type: 'static',
            linearDamping: 0.0,
            angularDamping: 0,
            allowSleep: true,
            bullet: true,
            gravitic: true,
            fixedRotation: false,
            fixtures: fixDefs
        });
    },

    registerSpecial: function (specialCtor) {
        this.specials.push(specialCtor);
    },

    tick: function (ctx) {
        IgeEntityBox2d.prototype.tick.call(this, ctx);
        if (ige.isServer) {
            this.rotateBy(0, 0, (0.1 * ige._tickDelta) * Math.PI / 180);
        }
    }
});

if (typeof(module) !== 'undefined' && typeof(module.exports) !== 'undefined') { module.exports = SpecialSupplier; }