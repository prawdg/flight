var Shield = AbstractSpecial.extend({
    classId: 'Shield',

    init: function () {
        AbstractSpecial.prototype.init.call(this);
        this._name = 'Shields';
        this.width(40).height(40);
    },

    setProperties: function () {
        this.activationDuration(5000);
        this.rechargeTime(-1);
        this.attached(true);
        this.needInput(true);
        this.effectDuration(0);
        this.chargeCount(-1);
    },

    getSpecialBody: function () {
        if (!this._specialBody) {
            var triangles,
                fixDefs,
                collisionPoly = ShapeUtils.createCShape(0, 0,
                    this.width() / 2, 0, Math.PI * 2, 8, 5);

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
                    density: 0.1,
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
            this._specialBody = {
                type: 'dynamic',
                linearDamping: 0.0,
                angularDamping: 1,
                allowSleep: true,
                bullet: false,
                gravitic: true,
                fixedRotation: false,
                fixtures: fixDefs
            };
        }
        return this._specialBody;
    },

    getSpecialTexture: function () {
        return ige.client.textures.shield;
    }
});

if (typeof(module) !== 'undefined' && typeof(module.exports) !== 'undefined') { module.exports = Shield; }