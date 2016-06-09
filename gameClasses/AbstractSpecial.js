var AbstractSpecial = IgeEntityBox2d.extend({
    classId: 'AbstractSpecial',

    init: function () {
        IgeEntityBox2d.prototype.init.call(this);

        if (ige.isServer) {
            this._activated = false;
            this.owner = null;
            this.streamMode(1);
            this.box2dBody(this.getSpriteBody());
            this.setProperties();
        }

        if (ige.isClient) {
            this.texture(this.getSpriteTexture());
        }
    },

    /**
     * Override to provide uncollected phase texture of special's sprite
     * @return {IgeTexture}
     */
    getSpriteTexture: function () {
        return null;
    },

    /**
     * Override to provide uncollected phase body of special's sprite
     * @return {Object] map of box2d properties of the special's sprite
     */
    getSpriteBody: function () {
        return {};
    },

    /**
     * Override to specify activation behaviour
     */
    _activate: function () {

    },

    activate: function () {
        if (this.rechargeTime() != -1) {
            if (!this._debouncedActivate) {
                this._debouncedActivate = CommonUtils.debounce(this._activate(), this.rechargeTime(), this);
            }
            if (this._debouncedActivate()) {
                if (this.chargeCount() != -1) {
                    this.chargeCount(this.chargeCount() - 1);
                }
            }
        } else {
            if (!this.isActivated()) {
                this._activated = true;
                this._activate();
            }
        }
    },

    /**
     * Override to specify deactivation behaviour
     */
    _deactivate: function () {
    },

    deactivate: function () {
        this._activated = false;
        this._deactivate();
    },

    isActivated: function () {
        return this._activated;
    },

    /**
     * Override to set properties that define special activation
     */
    setProperties: function () {
        this.activationDuration(-1);
        this.effectDuration(0);
        this.chargeCount(-1);
        this.rechargeTime(0);
    },

    // Properties setter/getter
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

    tick: function (ctx) {
        IgeEntityBox2d.prototype.tick.call(this, ctx);
        if (this.rechargeTime() == -1 && this.isActivated()) {
            this.activationDuration(this.activationDuration() - ige._tickDelta);
        }
    }
});

if (typeof(module) !== 'undefined' && typeof(module.exports) !== 'undefined') { module.exports = AbstractSpecial; }