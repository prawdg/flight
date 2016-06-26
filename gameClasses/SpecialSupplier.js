var SpecialSupplier = IgeEntityBox2d.extend({
    classId: 'SpecialSupplier',

    init: function () {
        IgeEntityBox2d.prototype.init.call(this);

        this.width(40).height(40);

        // TODO: refactor global properties into separate class
        this.SPECIAL_SPRITE_SIZE = 3;
        this.RECHARGE_TIME = 50000;


        if (ige.isClient) {
            this.texture(ige.client.textures.specialSup);
        }

        if (ige.isServer) {
            this._charge = 0;
            this._specialId = 0;
            this.specials = [];
            this._loadedSpecial = null;
            this._phase = SpecialSupplier.Phase.EMPTY;
            this._createBox2dBody();
        }
    },

    _createBox2dBody: function () {
        var triangles,
            fixDefs,
            collisionPoly = ShapeUtils.createCShape(0, 0,
                this.width() / 2, 4 * Math.PI / 6, 2 * Math.PI / 6, 16, 5);

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
            if (this._phase == SpecialSupplier.Phase.EMPTY && this.specials.length != 0) {
                var random = CommonUtils.randomInteger(this.specials.length);
                this._loadedSpecial = this.loadSpecial(this.specials[random]);
            } else if (this._phase == SpecialSupplier.Phase.GROWTH_START) {
                this.growSpecial(this._loadedSpecial);
            } else if (this._phase == SpecialSupplier.Phase.MATURITY) {
                this.releaseSpecial(this._loadedSpecial);
            } else if (this._phase == SpecialSupplier.Phase.RECHARGE) {
                this._charge += ige._tickDelta;
                if (this._charge > this.RECHARGE_TIME) {
                    this._charge = 0;
                    this._phase = SpecialSupplier.Phase.EMPTY;
                }
            }
        }
    },

    loadSpecial: function (ctor) {
        var special = new ctor()
            .id(this.id() + '_special_' + this._specialId++);
        var spriteCtor = special.spriteClass();
        var specialSprite = new spriteCtor()
            .special(special)
            .mount(ige.$('mainScene'))
            .streamMode(1);
        this._phase = SpecialSupplier.Phase.GROWTH_START;
        return specialSprite;
    },
    
    growSpecial: function (sprite) {
        var self = this;
        sprite._scale.tween().stepTo({x: 3, y: 3}, 5000).afterTween(function () {
            self._phase = SpecialSupplier.Phase.MATURITY;
        }).start();
        this._phase = SpecialSupplier.Phase.GROWING;
    },

    releaseSpecial: function (sprite) {
        sprite._box2dBody.ApplyForce(new ige.box2d.b2Vec2(
                5 * Math.cos(this._rotate.z + Math.radians(105)),
                5 * Math.sin(this._rotate.z + Math.radians(105))),
            sprite._box2dBody.GetWorldCenter());
        this._phase = SpecialSupplier.Phase.RECHARGE;
    }
});

SpecialSupplier.Phase = {
    EMPTY: 'phase_empty',
    GROWTH_START: 'phase_growth_start',
    GROWING: 'phase_growing',
    MATURITY: 'phase_maturity',
    ESCAPE: 'phase_escape',
    RECHARGE: 'phase_recharge'
};

if (typeof(module) !== 'undefined' && typeof(module.exports) !== 'undefined') { module.exports = SpecialSupplier; }