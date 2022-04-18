// Name: Joe Frumenti
// Project: Tim Allen Rocket Patrol Mod
// Date: 4/18/2022
// time to complete: 5 hours

// point breakdown:
// change theme 60 points
// visible timer 10 points
// adding time to timer via killing enemies 20 points
// simultaneous 2 player mode 30 points
// total: 120 points

let config = {
    type: Phaser.AUTO,
    width: 640,
    height: 480,
    scene: [Menu, Play]
}

let game = new Phaser.Game(config); 

let keyLEFT, keyRIGHT, keyUP, keyA, keyD, keyW, keyR, keyZ;

let timer;

let borderUISize = game.config.height / 15;
let borderPadding = borderUISize / 3;