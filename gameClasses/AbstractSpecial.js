var AbstractSpecial = IgeEntityBox2d.extend({
    classId: 'AbstractSpecial',

    init: function () {
        IgeEntityBox2d.prototype.init.call(this);

        var self = this;
        this._name = null;
        this.spriteClass(AbstractSpecialSprite);
        this._phase = AbstractSpecial.Phase.FREE;
        this.width(20).height(20);

        if (ige.isServer) {
            this._activated = false;
            this._owner = null;
            this.setProperties();
            this.hide();
        }

        if (ige.isClient) {
            this.texture(this.getSpecialTexture());
        }

        this.category('special');

        // Define the data sections that will be included in the stream
        this.streamSections(['transform', 'hidden']);
    },

    spriteClass: function (val) {
        if (val !== undefined) {
            this._spriteClass = val;
            return this;
        }
        return this._spriteClass;
    },

    owner: function (val) {
        if (val !== undefined) {
            this._owner = val;
            this._phase = AbstractSpecial.Phase.BINDING;
            this.mount(ige.server.mainScene);
            return this;
        }
        return this._owner;
    },

    getSpecialBody: function () {

    },

    getSpecialTexture: function () {

    },

    /**
     * Override to specify activation behaviour
     */
    _activate: function () {

    },

    activate: function () {
        if (this._rechargeTime == -1) {
            if (!this.isActivated()) {
                this._activated = true;
                this._activate();
            }
        } else {
            if (!this._debouncedActivate) {
                this._debouncedActivate = CommonUtils.debounce(this._activate(), this._rechargeTime, this);
            }
            if (this._debouncedActivate()) {
                if (this._chargeCount != -1) {
                    this._chargeCount -= 1;
                }
            }
        }
    },

    /**
     * Override to specify deactivation behaviour
     */
    _deactivate: function () {
    },

    deactivate: function () {
        if (this._rechargeTime == -1) {
            if (this.isActivated()) {
                this._activated = false;
                this._deactivate();
            }
        }
    },

    isActivated: function () {
        return this._activated;
    },

    /**
     * Override to set properties that define the special
     */
    setProperties: function () {
        // Whether player input is required or special
        // activates as soon as its collected (Auras).
        this.needInput(true);

        // Maximum duration that a special can be
        // activated for. -1 for unlimited.
        this.activationDuration(-1);

        // If special affects other players (Debuffs),
        // maximum duration of that effect, -1 for
        // unlimited. Ignored for non-Buff specials.
        this.effectDuration(0);

        // Maximum number of times a special can be
        // activated. -1 for unlimited.
        this.chargeCount(-1);

        // Time required between 2 activations of a
        // special. If -1, special remains active when
        // player input is held.
        this.rechargeTime(0);

        // Whether to attach the special on the player
        // All movement to player will be applied to
        // the special.
        this.attached(false);
    },

    // Properties setter/getter
    needInput: function (val) {
        if (val !== undefined) {
            this._needInput = val;
            return this;
        }
        return this._needInput;
    },

    activationDuration: function (val) {
        if (val !== undefined) {
            this._activationDuration = val;
            return this;
        }
        return this._activationDuration;
    },

    effectDuration: function (val) {
        if (val !== undefined) {
            this._effectDuration = val;
            return this;
        }
        return this._effectDuration;
    },

    chargeCount: function (val) {
        if (val !== undefined) {
            this._chargeCount = val;
            return this;
        }
        return this._chargeCount;
    },

    longPress: function (val) {
        if (val !== undefined) {
            this._longPress = val;
            return this;
        }
        return this._longPress;
    },

    rechargeTime: function (val) {
        if (val !== undefined) {
            this._rechargeTime = val;
            return this;
        }
        return this._rechargeTime;
    },

    attached: function (val) {
        if (val !== undefined) {
            this._attached = val;
            return this;
        }
        return this._attached;
    },

    tick: function (ctx) {
        IgeEntityBox2d.prototype.tick.call(this, ctx);
        if (ige.isServer) {
            if (this._phase === AbstractSpecial.Phase.BINDING) {
                var specialBody = this.getSpecialBody();
                if (specialBody) {
                    this.box2dBody(specialBody);
                }
                this.streamMode(1);
                if (!this._needInput) {
                    this.show();
                }
                this._phase = AbstractSpecial.Phase.BOUND;
                this._attachToOwner();
            } else if (this._phase === AbstractSpecial.Phase.BOUND) {
                if (this.rechargeTime() == -1) {
                    if (this.isActivated()) {
                        this._tickActivate();
                        this.activationDuration(this.activationDuration() - ige._tickDelta);
                    } else {
                        this.translateTo(this._owner._translate.x, this._owner._translate.y, this._owner._translate.x);
                        this._tickDeactivate();
                    }
                    if (this.activationDuration() < 0) {
                        this._tickDeactivate();
                        this.destroy();
                    }
                }
            }
        }
    },

    _tickActivate: function () {
        this._attachToOwner();
        this.show();
    },

    _tickDeactivate: function () {
        this._detachFromOwner();
        this.hide();
        this.streamSync();
    },

    _attachToOwner: function () {
        if (!this._attachJoint) {
            this.translateTo(this._owner._translate.x, this._owner._translate.y, this._owner._translate.x);
            this.rotateTo(this._owner._rotate.x, this._owner._rotate.y, this._owner._rotate.z);
            var b2WeldJointDef = Box2D.Dynamics.Joints.b2WeldJointDef;
            var joint_def = new b2WeldJointDef();
            joint_def.Initialize(this._owner._box2dBody, this._box2dBody, new ige.box2d.b2Vec2(0, 0));
            this._attachJoint = ige.box2d.world().CreateJoint(joint_def);
        }
    },

    _detachFromOwner: function () {
        if (this._attachJoint) {
            ige.box2d.world().DestroyJoint(this._attachJoint);
            this._attachJoint = undefined;
        }
    },

    destroy: function () {
        if (ige.isServer) {
            this._detachFromOwner();
            this._owner.removeSpecial(this);
        }
        IgeEntityBox2d.prototype.destroy.call(this);
    }
});

AbstractSpecial.Phase = {
    FREE: 'free',
    BINDING: 'binding',
    BOUND: 'bound'
};

if (typeof(module) !== 'undefined' && typeof(module.exports) !== 'undefined') { module.exports = AbstractSpecial; }