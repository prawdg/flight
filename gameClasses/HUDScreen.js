var HUDScreen = IgeScene2d.extend({
	classId: 'HUDScreen',
	
	init: function() {
		IgeScene2d.prototype.init.call(this);
		
		var self = this;
		
		this.hudProperties = {
			nickname: ''
		};

		this.ignoreCamera(true);
		
		ige.ui.style('.hud-screen-lbl-nickname', {
			'left': 5,
			'top': 0,
			'width': '50%',
			'height': 15
		});
			
		this.lblNickname = new IgeUiLabel()
			.id(this.id() + '_lblName')
			.color('#ffff00')
			.font('12px Verdana')
			.styleClass('hud-screen-lbl-nickname')
			.mount(this);
	},
	
	nickname: function(nickname) {
		if (nickname !== undefined) {
			this.hudProperties.nickname = nickname;
			this.lblNickname.value(this.hudProperties.nickname);
		} else {
			return this.hudProperties.nickname;
		}
	}
});