var image = {
    i: 0,
    render: function (ctx, entity) {

        var w = entity._bounds2d.x;
        var h = entity._bounds2d.y;
        var orientation = entity._rotate.z;
        ctx.strokeStyle = 'rgba(255, 0, 0, 0.5)';
        ctx.lineWidth = 5;
        console.log(Math.degrees(orientation));
        ctx.beginPath();
        ctx.arc(0, 0, w / 2,
            3 * Math.PI / 4,
            Math.PI / 4, false);
        ctx.stroke();
    }
};