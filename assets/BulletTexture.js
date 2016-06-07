var image = {
    render: function (ctx, entity) {
        var w = entity._bounds2d.x;
        var h = entity._bounds2d.y;
        // Draw the player entity
        ctx.fillStyle = 'rgba(255, 0, 0, 1)';
        ctx.beginPath();
        ctx.moveTo(-w, h);
        ctx.lineTo(w, h);
        ctx.lineTo(w, -h);
        ctx.lineTo(-w, -h);
        // ctx.arc(0, -h + 5, 5, 0, Math.PI, true);
        ctx.closePath();
        ctx.fill();
    }
};