var Load = {
  preload: function() {
    var loadingLabel = game.add.text(game.world.centerX, 150, 'Loading!', { font: '28px Sans Comic', fill: '#ffffff' });
    loadingLabel.anchor.setTo(0.5, 0,5);
    
    var progressBar = game.add.sprite(game.world.centerX, 200, 'progressBar');
    progressBar.anchor.setTo(0.5, 0.5);
    game.load.setPreloadSprite(progressBar);
    
	
	
	    game.load.image('snake', './assets/images/snake.png');
        game.load.image('apple', './assets/images/apple.png');
		game.load.image('upButton', './assets/images/uparrow.png?' + Date.now());
		game.load.image('rightButton', './assets/images/rightarrow.png?' + Date.now());
		game.load.image('downButton', './assets/images/downarrow.png?' + Date.now());
		game.load.image('leftButton', './assets/images/leftarrow.png?' + Date.now());
		game.load.audio('hit', './assets/sounds/gameOver.mp3?', './assets/sounds/gameOver.ogg?' + Date.now());
    
  },
  
  create: function() {
	  game.stage.backgroundColor = '#061ffff';
	  console.log("foobar");
	  
    game.state.start('Menu');
  }
};