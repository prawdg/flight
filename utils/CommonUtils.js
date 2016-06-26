var CommonUtils = {

    /**
     * Returns a debounced version of fn.
     *
     * @param fn
     * @param threshold
     * @param scope
     * @return {Function}
     */
    debounce: function (fn, threshold, scope) {
        threshold || (threshold = 250);
        var last,
            deferTimer;
        return function () {
            var context = scope || this;

            var now = +new Date(),
                args = arguments;
            if (!last || now > last + threshold) {
                last = now;
                fn.apply(context, args);
                return true;
            }
            return false;
        };
    },

    randomInteger: function (limit) {
        return Math.floor(Math.random() * limit);
    },

    randomFloat: function (limit) {
        return Math.random() * limit;
    }
};

if (typeof(module) !== 'undefined' && typeof(module.exports) !== 'undefined') { module.exports = CommonUtils; }