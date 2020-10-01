var Menu = {

    preload : function() {
			//game.load.image('progressBar', './assets/images/progressBar.png');
		
		
        // Load all the needed resources for the menu.
		
        game.load.image('menu', './assets/images/menuc.png');
		
    },

    create: function () {

        // Add menu screen.
        // It will act as a button to start the game.
		// Create the tween
/*
var startLabel = game.add.text(game.world.centerX, 0, 'Begin tha snake game',
{ font: '50px Arial', fill: '#ffffff' });
var tween = game.add.tween(startLabel);
// Rotate the label to -2 degrees in 500ms
tween.to({angle: -2}, 500);
// Then rotate the label to +2 degrees in 500ms
tween.to({angle: 2}, 500);
// Loop indefinitely the tween
tween.loop();
// Start the tween
tween.start();


game.add.tween(startLabel).to({angle: -2}, 500).to({angle: 2}, 500).loop()
.start();
*/
        this.add.button(0, 0, 'menu', this.startGame, this);

    },

    startGame: function () {

        // Change the state to the actual game.
        this.state.start('Game');

    }

};