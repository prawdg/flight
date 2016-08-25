var image = {
	render: function (ctx, entity) {
		var gradient = ctx.createLinearGradient(0, -entity._bounds2d.y2,
			0, entity._bounds2d.y2);
		var remainingHealth = 1 - entity.health() / entity.MAX_HEALTH;
		gradient.addColorStop(0, 'black');
		gradient.addColorStop(remainingHealth, 'black');
		gradient.addColorStop(remainingHealth, 'red');
		gradient.addColorStop(1, 'red');
		ctx.fillStyle = gradient;
		ctx.beginPath();
		ctx.moveTo(0, -entity._bounds2d.y2);
		ctx.lineTo(entity._bounds2d.x2, entity._bounds2d.y2);
		ctx.lineTo(0, entity._bounds2d.y2 - 5);
		ctx.lineTo(-entity._bounds2d.x2, entity._bounds2d.y2);
		ctx.closePath();
		ctx.fill();

		ctx.strokeStyle = 'red';
		ctx.beginPath();
		ctx.moveTo(0, -entity._bounds2d.y2);
		ctx.lineTo(entity._bounds2d.x2, entity._bounds2d.y2);
		ctx.lineTo(0, entity._bounds2d.y2 - 5);
		ctx.lineTo(-entity._bounds2d.x2, entity._bounds2d.y2);
		ctx.closePath();
		ctx.stroke();
	}
};