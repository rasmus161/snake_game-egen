var Boot = {

	preload: function () {
		game.load.image('progressBar', './assets/images/progressBar.png');
	
		
		
	},

	create: function() { 
		// If the device is not a desktop, so it's a mobile device
		if(!game.device.desktop) {
			// Set the type of scaling to 'show all'
			game.scale.scaleMode = Phaser.ScaleManager.SHOW_ALL;
			
			// Add blue color to the page, to hide hide the white borders we might have
			document.body.style.backgroundColor = '#0d0d0d';
		
			// Set the min and max width/height of the game
			game.scale.minWidth = 250;
			game.scale.minHeight = 170;
			game.scale.maxWidth = 1200;
			game.scale.maxHeight = 900;
			
			// Center the game on the screen
			game.stage.scale.pageAlignHorizontally = true;
			game.stage.scale.pageAlignVertically = true;
			
			// Apply the scale changes
			game.scale.setScreenSize(true);		
			
			// Apply the mobile css
			var stylesheet = document.styleSheets[0];
			
			stylesheet.disabled = true;
			
			game.state.start('Menu');
			
		}
		else {
			var stylesheet = document.styleSheets[1];
			
			stylesheet.disabled = true;
			
			game.state.start('Menu');
		
		}
	
	},
	
	startGame: function () {
		
		game.state.start('Menu');
	
	}
	
};