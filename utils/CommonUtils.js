var CommonUtils = {
    debounce: function (fn, threshhold, scope) {
        threshhold || (threshhold = 250);
        var last,
            deferTimer;
        return function () {
            var context = scope || this;

            var now = +new Date(),
                args = arguments;
            if (!last || now > last + threshhold) {
                last = now;
                fn.apply(context, args);
            }
        };
    }
};

if (typeof(module) !== 'undefined' && typeof(module.exports) !== 'undefined') { module.exports = CommonUtils; }