var snake, apple, squareSize, score, speed,
    updateDelay, direction, new_direction,
    addNew, cursors, scoreTextValue, speedTextValue, textStyle_Key, textStyle_Value;

var Game = {

    preload : function() {
		//game.load.image('progressBar', './assets/images/progressBar.png');
		
        // Here we load all the needed resources for the level.
        // In our case, that's just two squares - one for the snake body and one for the apple.
		
        game.load.image('snake', './assets/images/snake.png');
        game.load.image('apple', './assets/images/apple.png');
		game.load.image('upButton', './assets/images/uparrow.png?' + Date.now());
		game.load.image('rightButton', './assets/images/rightarrow.png?' + Date.now());
		game.load.image('downButton', './assets/images/downarrow.png?' + Date.now());
		game.load.image('leftButton', './assets/images/leftarrow.png?' + Date.now());
		game.load.audio('eat', './assets/sounds/death.mp3?', './assets/sounds/death2.ogg?' + Date.now());
		game.load.audio('hit', './assets/sounds/gameOver.mp3?', './assets/sounds/gameOver.ogg?' + Date.now());
		
		
		
    },

    create : function() {

        // By setting up global variables in the create function, we initialise them on game start.
        // We need them to be globally available so that the update function can alter them.

        snake = [];                     // This will work as a stack, containing the parts of our snake
        apple = {};                     // An object for the apple;
        squareSize = 15;                // The length of a side of the squares. Our image is 15x15 pixels.
        score = 0;                      // Game score.
        speed = 0;                      // Game speed.
        updateDelay = 0;                // A variable for control over update rates.
        direction = 'right';            // The direction of our snake.
        new_direction = null;           // A buffer to store the new direction into.
        addNew = false;                 // A variable used when an apple has been eaten.
		
		eatingAudio = this.add.audio('eat');
		gameoverAudio = this.add.audio('hit');

        // Set up a Phaser controller for keyboard input.
        cursors = game.input.keyboard.createCursorKeys();

        game.stage.backgroundColor = '#061f27';

        // Generate the initial snake stack. Our snake will be 10 elements long.
        for(var i = 0; i < 10; i++){
            snake[i] = game.add.sprite(150+i*squareSize, 150, 'snake');  // Parameters are (X coordinate, Y coordinate, image)
        }


        // Genereate the first apple.
        this.generateApple();

        // Add Text to top of game.
        textStyle_Key = { font: "bold 14px sans-serif", fill: "#fff", align: "center" };
        textStyle_Value = { font: "bold 18px sans-serif", fill: "#fff", align: "center" };

        // Score.
       game.add.text(30, 20, "score", textStyle_Key);
        this.scoreTextValue = game.add.text(90, 18, score.toString(), textStyle_Value);
        // Speed.
        game.add.text(500, 20, "speed", textStyle_Key);
        this.speedTextValue = game.add.text(558, 18, speed.toString(), textStyle_Value);
		
		// If the game is running on a mobile device
		if (!game.device.desktop) {
			// Display the mobile inputs
			this.addMobileInputs();
		}

    },

    update: function() {

        // Handle arrow key presses, while not allowing illegal direction changes that will kill the player.

        if(cursors.right.isDown && direction!='left' || this.moveRight && direction!='left'){
			new_direction = 'right';
		} 
		else if (cursors.left.isDown && direction!='right' || this.moveLeft && direction!='right'){
			new_direction = 'left';
		}
		else if (cursors.up.isDown && direction!='down' || this.moveUp && direction!='down'){
			new_direction = 'up';
		}
		else if (cursors.down.isDown && direction!='up' || this.moveDown && direction!='up'){
			new_direction = 'down';
		}

        // A formula to calculate game speed based on the score.
        // The higher the score, the higher the game speed, with a maximum of 10;
        speed = Math.min(10, Math.floor(score/5));
        // Update speed value on game screen.
        this.speedTextValue.text = '' + speed;

        // Since the update function of Phaser has an update rate of around 60 FPS,
        // we need to slow that down make the game playable.

        // Increase a counter on every update call.
        updateDelay++;

        // Do game stuff only if the counter is aliquot to (10 - the game speed).
        // The higher the speed, the more frequently this is fulfilled,
        // making the snake move faster.
        if (updateDelay % (10 - speed) == 0) {


            // Snake movement

            var firstCell = snake[snake.length - 1],
                lastCell = snake.shift(),
                oldLastCellx = lastCell.x,
                oldLastCelly = lastCell.y;

            // If a new direction has been chosen from the keyboard, make it the direction of the snake now.
            if(new_direction){
                direction = new_direction;
                new_direction = null;
            }


            // Change the last cell's coordinates relative to the head of the snake, according to the direction.

            if(direction == 'right'){

                lastCell.x = firstCell.x + 15;
                lastCell.y = firstCell.y;
            }
            else if(direction == 'left'){
                lastCell.x = firstCell.x - 15;
                lastCell.y = firstCell.y;
            }
            else if(direction == 'up'){
                lastCell.x = firstCell.x;
                lastCell.y = firstCell.y - 15;
            }
            else if(direction == 'down'){
                lastCell.x = firstCell.x;
                lastCell.y = firstCell.y + 15;
            }


            // Place the last cell in the front of the stack.
            // Mark it as the first cell.

            snake.push(lastCell);
            firstCell = lastCell;

            // End of snake movement.



            // Increase length of snake if an apple had been eaten.
            // Create a block in the back of the snake with the old position of the previous last block (it has moved now along with the rest of the snake).
            if(addNew){
                snake.unshift(game.add.sprite(oldLastCellx, oldLastCelly, 'snake'));
                addNew = false;
            }

            // Check for apple collision.
            this.appleCollision();

            // Check for collision with self. Parameter is the head of the snake.
            this.selfCollision(firstCell);

            // Check with collision with wall. Parameter is the head of the snake.
            this.wallCollision(firstCell);
        }


    },
	addMobileInputs: function() {
		
		// Movement variables
		this.moveUp = false;
		this.moveRight = false;
		this.moveDown = false;
		this.moveLeft = false;


		// Add the up button
		this.upButton = game.add.sprite(65, 250, 'upButton');
		this.upButton.inputEnabled = true;
		this.upButton.events.onInputOver.add(function(){this.moveUp = true; this.upButton.alpha = 1;}, this);
		this.upButton.events.onInputOut.add(function(){this.moveUp = false; this.upButton.alpha = 0.5;}, this);
		this.upButton.events.onInputDown.add(function(){this.moveUp = true; this.upButton.alpha = 1;}, this);
		this.upButton.events.onInputUp.add(function(){this.moveUp = false; this.upButton.alpha = 0.5;}, this);
		this.upButton.alpha = 0.5;
		
		// Add the right button
		this.rightButton = game.add.sprite(125, 310, 'rightButton');
		this.rightButton.inputEnabled = true;
		this.rightButton.events.onInputOver.add(function(){this.moveRight = true; this.rightButton.alpha = 1;}, this);
		this.rightButton.events.onInputOut.add(function(){this.moveRight = false; this.rightButton.alpha = 0.5;}, this);
		this.rightButton.events.onInputDown.add(function(){this.moveRight = true; this.rightButton.alpha = 1;}, this);
		this.rightButton.events.onInputUp.add(function(){this.moveRight = false; this.rightButton.alpha = 0.5;}, this);
		this.rightButton.alpha = 0.5;
		
		// Add the down button
		this.downButton = game.add.sprite(65, 370, 'downButton');
		this.downButton.inputEnabled = true;
		this.downButton.events.onInputOver.add(function(){this.moveDown = true; this.downButton.alpha = 1;}, this);
		this.downButton.events.onInputOut.add(function(){this.moveDown = false; this.downButton.alpha = 0.5;}, this);
		this.downButton.events.onInputDown.add(function(){this.moveDown = true; this.downButton.alpha = 1;}, this);
		this.downButton.events.onInputUp.add(function(){this.moveDown = false; this.downButton.alpha = 0.5;}, this);
		this.downButton.alpha = 0.5;
		
		// Add the left button
		this.leftButton = game.add.sprite(5, 310, 'leftButton');
		this.leftButton.inputEnabled = true;
		this.leftButton.events.onInputOver.add(function(){this.moveLeft = true; this.leftButton.alpha = 1;}, this);
		this.leftButton.events.onInputOut.add(function(){this.moveLeft = false; this.leftButton.alpha = 0.5;}, this);
		this.leftButton.events.onInputDown.add(function(){this.moveLeft = true; this.leftButton.alpha = 1;}, this);
		this.leftButton.events.onInputUp.add(function(){this.moveLeft = false; this.leftButton.alpha = 0.5;}, this);
		this.leftButton.alpha = 0.5;
	
	},

    generateApple: function(){

        // Chose a random place on the grid.
        // X is between 0 and 585 (39*15)
        // Y is between 0 and 435 (29*15)

        var randomX = Math.floor(Math.random() * 40 ) * squareSize,
            randomY = Math.floor(Math.random() * 30 ) * squareSize;

        // Add a new apple.
        apple = game.add.sprite(randomX, randomY, 'apple');
    },

    appleCollision: function() {

        // Check if any part of the snake is overlapping the apple.
        // This is needed if the apple spawns inside of the snake.
        for(var i = 0; i < snake.length; i++){
            if(snake[i].x == apple.x && snake[i].y == apple.y){

                // Next time the snake moves, a new block will be added to its length.
                addNew = true;
				
				eatingAudio.play();

                // Destroy the old apple.
                apple.destroy();

                // Make a new one.
                this.generateApple();

                // Increase score.  Men då börjar masken fara fortare ++ = + =1
                score += 1;

                // Refresh scoreboard.
               this.scoreTextValue.text = score.toString();

            }
        }

    },

    selfCollision: function(head) {

        // Check if the head of the snake overlaps with any part of the snake.
        for(var i = 0; i < snake.length - 1; i++){
            if(head.x == snake[i].x && head.y == snake[i].y){

                // If so, go to game over screen.
				gameoverAudio.loop = false;
				gameoverAudio.play();
                game.state.start('Game_Over');
				
            }
        }

    },

    wallCollision: function(head) {

        // Check if the head of the snake is in the boundaries of the game field.

        if(head.x >= 600 || head.x < 0 || head.y >= 450 || head.y < 0){


            // If it's not in, we've hit a wall. Go to game over screen.
			gameoverAudio.loop = false;
			gameoverAudio.play();
            game.state.start('Game_Over');
        }

    }

};