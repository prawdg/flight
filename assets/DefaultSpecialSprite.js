var image = {
    render: function (ctx, entity) {

        var w = entity._bounds2d.x;
        var h = entity._bounds2d.y;
        var gradient = ctx.createRadialGradient(0, 0, 1, 0, 0, w / 2);
        gradient.addColorStop(0, 'blue');
        gradient.addColorStop(1, 'black');
        ctx.fillStyle = gradient;
        ctx.lineWidth = 5;
        ctx.beginPath();
        ctx.arc(0, 0, w / 2,
            0,
            2 * Math.PI, false);
        ctx.fill();
    }
};