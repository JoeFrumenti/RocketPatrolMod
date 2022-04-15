class Play extends Phaser.Scene
{
    constructor()
    {
        super("playScene");
    }


    preload()
    {
        this.load.image('rocket', 'assets/timallen1.png');
        this.load.image('spaceship','assets/timallen1.png');
        this.load.image('starfield', 'assets/timallen1.png');
        this.load.spritesheet('explosion', 'assets/explosion.png', {frameWidth: 64, frameHeight: 32, startFrame: 0, endFrame: 9});

        this.load.audio('sfx_select', 'assets/Grunt.wav');
        this.load.audio('sfx_explosion', 'assets/Grunt.wav');
        this.load.audio('sfx_rocket', 'assets/Grunt.wav');
    }

    create()
    {
        //timer
        //var elapsed = timer.getElapsed();
        this.timer = game.settings.gameTimer/1000 - 1;

        this.addedTime = 0;
        

        //green UI background
        this.add.rectangle(0, borderUISize + borderPadding, game.config.width, borderUISize * 2, 0x00FF00).setOrigin(0,0);

        //white borders
        this.add.rectangle(0, 0, game.config.width, borderUISize, 0xFFFFFF).setOrigin(0,0);
        this.add.rectangle(0, game.config.width - borderUISize, game.config.width, borderUISize, 0xFFFFFF).setOrigin(0,0);
        this.add.rectangle(0, 0, borderUISize, game.config.height, 0xFFFFFF).setOrigin(0, 0);
        this.add.rectangle(game.config.width - borderUISize, 0, borderUISize, game.config.height, 0xFFFFFF).setOrigin(0, 0);
        
        this.starfield = this.add.tileSprite(0,0,640,480, 'starfield').setOrigin(0,0);

        this.p1Rocket = new Rocket(this, game.config.width/2, game.config.height - borderUISize - borderPadding, 'rocket').setOrigin(0.5, 0);
        this.p2Rocket = new RocketP2(this, game.config.width/2, game.config.height - borderUISize - borderPadding, 'rocket').setOrigin(0.5, 0);

        this.ship01 = new Spaceship(this, game.config.width + borderUISize * 6, borderUISize * 4, 'spaceship', 0, 30).setOrigin(0,0);
        this.ship02 = new Spaceship(this, game.config.width + borderUISize*3, borderUISize*5 + borderPadding*2, 'spaceship', 0, 20).setOrigin(0,0);
        this.ship03 = new Spaceship(this, game.config.width, borderUISize*6 + borderPadding*4, 'spaceship', 0, 10).setOrigin(0,0)

        keyLEFT = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.LEFT);
        keyRIGHT = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.RIGHT);
        keyUP = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.UP);
        keyA = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.A);
        keyD = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.D);
        keyW = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.W);
        keyR = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.R);
        //keyZ = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.Z);

        this.anims.create({
            key: 'explode',
            frames: this.anims.generateFrameNumbers('explosion', {start: 0, end: 9, first: 0}),
            framerate: 30
        });

        this.p1Score = 0;
        this.p2Score = 0;

        // display score
         let scoreConfig = {
            fontFamily: 'Courier',
            fontSize: '28px',
            backgroundColor: '#F3B141',
            color: '#843605',
            align: 'right',
            padding: {
                top: 5,
                bottom: 5,
            },
            fixedWidth: 100
        }   
        this.scoreLeft = this.add.text(borderUISize + borderPadding, borderUISize + borderPadding*2, this.p1Score, scoreConfig);
        this.timeLeft = this.add.text((game.config.width - borderPadding)/2, borderUISize + borderPadding*2, this.timer, 'Courier');
    
        //GAME OVER FLAG
        this.gameOver = false;

        scoreConfig.fixedWidth = 0;
        this.endGame(game.settings.gameTimer);

        this.updateTime();
    }

    update()
    {
        
        if (this.gameOver && Phaser.Input.Keyboard.JustDown(keyR)) 
        {
            this.scene.restart();
        }
        if (this.gameOver && Phaser.Input.Keyboard.JustDown(keyLEFT)) {
            this.scene.start("menuScene");
        }

        //this was to test addtime function
        // if (Phaser.Input.Keyboard.JustDown(keyZ)) 
        // {
        //     this.addTime(5);
        // }

        this.starfield.tilePositionX -=4;
        if(!this.gameOver)
        {
            this.p1Rocket.update();
            this.p2Rocket.update();

            this.ship01.update();
            this.ship02.update();
            this.ship03.update();
        }

        if(this.checkCollision(this.p1Rocket, this.ship01))
        {
            this.addTime(6);
            this.p1Rocket.reset();
            this.shipExplode(this.ship01)
        }
        if(this.checkCollision(this.p1Rocket, this.ship02))
        {
            this.addTime(4);
            this.p1Rocket.reset();
            this.shipExplode(this.ship02)
        }
        if(this.checkCollision(this.p1Rocket, this.ship03))
        {
            this.addTime(2);
            this.p1Rocket.reset();
            this.shipExplode(this.ship03)
        }

        

        if(this.checkCollision(this.p2Rocket, this.ship01))
        {
            this.p2Rocket.reset();
            this.shipExplode(this.ship01)
        }
        if(this.checkCollision(this.p2Rocket, this.ship02))
        {
            this.p2Rocket.reset();
            this.shipExplode(this.ship02)
        }
        if(this.checkCollision(this.p2Rocket, this.ship03))
        {
            this.p2Rocket.reset();
            this.shipExplode(this.ship03)
        }

        //this.updateTime();

    }

    updateTime()
    {
        if(this.timer > 0)
        this.clock = this.time.delayedCall(1000, () => {
            this.timer -=1;
            this.timeLeft.setText(this.timer);
            this.updateTime();  
        }, null, this);
        
    }
    checkCollision(rocket, ship)
    {
        if (rocket.x < ship.x + ship.width &&
            rocket.x + rocket.width > ship.x &&
            rocket.y < ship.y + ship.height &&
            rocket.height + rocket.y > ship.y)
            {
                return true;
            }
            else
            {
                return false;
            }
    }

    shipExplode(ship)
    {
        ship.alpha = 0;

        let boom = this.add.sprite(ship.x,ship.y, 'explosion').setOrigin(0,0);
        boom.anims.play('explode');
        boom.on('animationcomplete', () => {
            ship.reset();
            ship.alpha = 1;
            boom.destroy();
        });

        this.p1Score += ship.points;
        this.scoreLeft.text = this.p1Score;

        this.sound.play('sfx_explosion');
    }

    endGame(extraTime)
    {
        //start the death countdown
        this.clock = this.time.delayedCall(extraTime, () => {

            //if no time has been added to the clock since the last time endgame was called, end game
            if(this.addedTime === 0)
            {
                this.add.text(game.config.width/2, game.config.height/2, 'GAME OVER', "courier").setOrigin(0.5);
                this.add.text(game.config.width/2, game.config.height/2 + 64, 'Press (R) to Restart or ← for menu', "Courier").setOrigin(0.5);  
                this.gameOver = true;  
            }

            //else, start a new endgame timer with current remaining time
            else
            {
                let temp = this.addedTime;
                this.addedTime = 0;
                this.endGame(temp);
            }
        
            
            }, null, this);

    }

    //adds time to the game's death countdown timer, and updates the visual timer
    addTime(seconds)
    {
        this.addedTime += seconds * 1000;
        this.timer += seconds;
        this.timeLeft.setText(this.timer);
    }
}