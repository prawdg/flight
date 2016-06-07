var ShapeUtils = {

    createCShape: function (centerX, centerY, radius, startAngle, endAngle, points, thickness) {
        startAngle = startAngle || 0;
        endAngle = endAngle || 2 * Math.PI;
        points = points || 16;
        thickness = thickness || 1;
        if (endAngle < startAngle) {
            endAngle += Math.PI * 2;
        }
        var stepAngle = (endAngle - startAngle) / (points - 1);
        var poly = new IgePoly2d();
        radius = radius + thickness / 2;
        for (var i = 1, angle = startAngle; i <= points; i++) {
            poly.addPoint(radius * Math.cos(angle), radius * Math.sin(angle));
            angle += stepAngle;
        }
        radius = radius - thickness;
        for (var i = 1; i <= points; i++) {
            poly.addPoint(radius * Math.cos(angle), radius * Math.sin(angle));
            angle -= stepAngle;
        }
        return poly;
    }
};

if (typeof(module) !== 'undefined' && typeof(module.exports) !== 'undefined') { module.exports = ShapeUtils; }