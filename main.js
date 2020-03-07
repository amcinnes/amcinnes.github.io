var config = {
    width: 800,
    height: 600,
    physics: {
        default: 'arcade',
        arcade: {
        }
    },
    scene: {
        preload: preload,
        create: create,
        update: update
    },
    backgroundColor: 0xffffff
};

var game = new Phaser.Game(config);

var cursors;
var character;
var scoreCounter;
var score = 0;

const CHARACTER_SPEED=200;

function preload () {
    this.load.image('character', 'character.png');
    this.load.image('paper', 'paper.png');
}

function create () {
    cursors = this.input.keyboard.createCursorKeys();
    character = this.physics.add.image(400, 100, 'character');
    paper = this.physics.add.image(400, 300, 'paper');
    this.physics.add.overlap(character, paper, collectPaper, null, this);
    scoreCounter = this.add.text(10, 10, 'Score: 0', { fontFamily: 'Arial', fontSize: 18, color: '#000000' });
}

function update() {
    character.setVelocity(0);
    if (cursors.left.isDown) {
        character.setVelocityX(-CHARACTER_SPEED);
    } else if (cursors.right.isDown) {
        character.setVelocityX(CHARACTER_SPEED);
    }
    if (cursors.up.isDown) {
        character.setVelocityY(-CHARACTER_SPEED);
    } else if (cursors.down.isDown) {
        character.setVelocityY(CHARACTER_SPEED);
    }
}

function collectPaper(player, paper) {
    // increment score
    // change location of paper
    // TODO confine paper to environment
    var x = Math.random() * 800;
    var y = Math.random() * 600;
    paper.setPosition(x, y);
    score++;
    scoreCounter.setText('Score: ' + score);
}
