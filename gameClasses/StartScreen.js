var StartScreen = IgeScene2d.extend({
	classId: 'StartScreen',
	
	init: function() {
		IgeScene2d.prototype.init.call(this);
		
		var self = this;
		var txtName;

		this.ignoreCamera(true);
		
		ige.ui.style('.start-screen-txt-name', {
			'left': '40%',
			'top': '30%',
			'width': '20%',
			'height': 30,
			'borderRadius': 5,
			'borderColor': '#ffffff',
			'borderWidth': 1
		});
			
		txtName = new IgeUiTextBox()
			.id(this.id() + '_txtName')
			.color('#ffff00')
			.font('20px Verdana')
			.styleClass('start-screen-txt-name')
			.mount(this);
		txtName._fontEntity.textAlignX(1);

		txtName.on('enter', function(e) {
			self.emit(StartScreen.EventType.SET_NAME, e);
		});
	}
});
StartScreen.EventType = {
	SET_NAME: 'setName'
};