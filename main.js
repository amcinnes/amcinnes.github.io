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
const CHARACTER_SPEED=200;

function preload () {
    this.load.image('character', 'character.png');
}

function create () {
    cursors = this.input.keyboard.createCursorKeys();
    character = this.physics.add.image(400, 100, 'character');
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
