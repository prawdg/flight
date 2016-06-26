var AbstractSpecialSprite = IgeEntityBox2d.extend({
    classId: 'AbstractSpecialSprite',

    init: function () {
        IgeEntityBox2d.prototype.init.call(this);
        var self = this;
        this.width(5).height(5);

        if (ige.isServer) {
            this.box2dBody(this.getSpriteBody());
        }

        if (ige.isClient) {
            this.texture(this.getSpriteTexture());
        }

        this.category('special_sprite');
    },

    special: function (val) {
        if (val !== undefined) {
            this._special = val;
            return this;
        }
        return this._special;
    },

    /**
     * Override to provide uncollected _phase texture of special's sprite
     * @return {IgeTexture}
     */
    getSpriteTexture: function () {
        return ige.client.textures.defaultSpecial;
    },

    /**
     * Override to provide uncollected _phase body of special's sprite
     * @return {Object] map of box2d properties of the special's sprite
     */
    getSpriteBody: function () {
        if (!this._spriteBody) {
            var triangles,
                fixDefs,
                collisionPoly = ShapeUtils.createCShape(0, 0,
                    this.width() / 2, 0, Math.PI * 2, 8);

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
                    restitution: 1,
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
            this._spriteBody = {
                type: 'dynamic',
                linearDamping: 0.0,
                angularDamping: 0,
                allowSleep: true,
                bullet: false,
                gravitic: true,
                fixedRotation: false,
                fixtures: fixDefs
            };
        }
        return this._spriteBody;
    }
});

if (typeof(module) !== 'undefined' && typeof(module.exports) !== 'undefined') { module.exports = AbstractSpecialSprite; }