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
var obstacles;

const CHARACTER_SPEED=200;

function preload () {
    this.load.image('character', 'character.png');
    this.load.image('paper', 'paper.png');
    this.load.image('background', 'background.png');
    this.load.image('shelf1', 'shelf1.png');
    this.load.image('shelf2', 'shelf2.png');
    this.load.image('shelf3', 'shelf3.png');
    this.load.image('shelf4', 'shelf4.png');
    this.load.image('shelf5', 'shelf5.png');
    this.load.image('hwall', 'hwall.png');
    this.load.image('vwall', 'vwall.png');
}

function create () {
    cursors = this.input.keyboard.createCursorKeys();
    this.add.image(400, 300, 'background').setScale(1.25);
    obstacles = [
        this.physics.add.image(400, 180, 'shelf1').setImmovable(true),
        this.physics.add.image(150, 180, 'shelf2').setImmovable(true),
        this.physics.add.image(600, 400, 'shelf3').setImmovable(true),
        this.physics.add.image(380, 420, 'shelf4').setImmovable(true),
        this.physics.add.image(160, 420, 'shelf5').setImmovable(true),
        this.physics.add.image(620, 200, 'shelf5').setImmovable(true),
        this.physics.add.image(400, 15, 'hwall').setImmovable(true),
        this.physics.add.image(400, 585, 'hwall').setImmovable(true),
        this.physics.add.image(15, 300, 'vwall').setImmovable(true),
        this.physics.add.image(785, 300, 'vwall').setImmovable(true)];
    character = this.physics.add.image(200, 100, 'character');
    character.setSize(38, 78, true);
    paper = this.physics.add.image(400, 300, 'paper');
    paper.setSize(70, 50, true);
    this.physics.add.overlap(character, paper, collectPaper, null, this);
    this.physics.add.collider(character, obstacles);
    scoreCounter = this.add.text(6, 3, 'Score: 0', { fontFamily: 'Arial', fontSize: 18, color: '#ffffff' });
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
    // Put paper on one of these lines that doesn't overlap with obstacles
    // I'd be happy to just create it in any random location that doesn't overlap with obstacles
    // but can't figure out how to do that easily
    if (Math.random() >= 0.5) {
        var xChoices = [65, 280, 510, 725];
        var x = xChoices[Math.floor(Math.random()*xChoices.length)];
        var y = Math.random() * (560-40) + 40;
        paper.setPosition(x, y);
    } else {
        var yChoices = [80, 305, 515];
        var x = Math.random() * (760-40) + 40;
        var y = yChoices[Math.floor(Math.random()*yChoices.length)];
        paper.setPosition(x, y);
    }
    // increment score
    score++;
    scoreCounter.setText('Score: ' + score);
}
