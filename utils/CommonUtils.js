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
        var last;
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

    /**
     * Calls the function fn with provided scope if it was not called in the last threshold ms.
     * Note: adds a variable __debounceLast__ to the scope for bookkeeping.
     *
     * @param fn
     * @param threshold
     * @param scope
     * @return true if the function was called, else false
     */
    debouncedCall: function (fn, threshold, scope) {
        threshold || (threshold = 250);
        var context = scope || this;
        context.__debounceLast__ = context.__debounceLast__ || [];
        var now = +new Date(),
            args = arguments;

        if (!context.__debounceLast__[fn] || now > context.__debounceLast__[fn] + threshold) {
            context.__debounceLast__[fn] = now;
            fn.apply(context, args);
            return true;
        }
        return false;
    },

    randomInteger: function (limit) {
        return Math.floor(Math.random() * limit);
    },

    randomFloat: function (limit) {
        return Math.random() * limit;
    }
};

if (typeof(module) !== 'undefined' && typeof(module.exports) !== 'undefined') { module.exports = CommonUtils; }