var image = {
    render: function (ctx, entity) {

        var w = entity._bounds2d.x;
        var h = entity._bounds2d.y;
        var orientation = entity._rotate.z;
        ctx.strokeStyle = 'rgba(255, 0, 0, 0.5)';
        ctx.lineWidth = 5;
        ctx.beginPath();
        ctx.arc(0, 0, w / 2,
            4 * Math.PI / 6,
            2 * Math.PI / 6, false);
        ctx.stroke();
    }
};