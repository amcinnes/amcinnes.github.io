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
    var shelf1 = this.physics.add.image(400, 180, 'shelf1').setImmovable(true);
    var shelf2 = this.physics.add.image(150, 180, 'shelf2').setImmovable(true);
    var shelf3 = this.physics.add.image(600, 400, 'shelf3').setImmovable(true);
    var shelf4 = this.physics.add.image(380, 420, 'shelf4').setImmovable(true);
    var shelf5 = this.physics.add.image(160, 420, 'shelf5').setImmovable(true);
    var shelf6 = this.physics.add.image(620, 200, 'shelf5').setImmovable(true);
    var hwall1 = this.physics.add.image(400, 15, 'hwall').setImmovable(true);
    var hwall2 = this.physics.add.image(400, 585, 'hwall').setImmovable(true);
    var vwall1 = this.physics.add.image(15, 300, 'vwall').setImmovable(true);
    var vwall2 = this.physics.add.image(785, 300, 'vwall').setImmovable(true);
    character = this.physics.add.image(200, 100, 'character');
    character.setSize(38, 78, true);
    paper = this.physics.add.image(400, 300, 'paper');
    paper.setSize(70, 50, true);
    this.physics.add.overlap(character, paper, collectPaper, null, this);
    this.physics.add.collider(character, shelf1);
    this.physics.add.collider(character, shelf2);
    this.physics.add.collider(character, shelf3);
    this.physics.add.collider(character, shelf4);
    this.physics.add.collider(character, shelf5);
    this.physics.add.collider(character, shelf6);
    this.physics.add.collider(character, hwall1);
    this.physics.add.collider(character, hwall2);
    this.physics.add.collider(character, vwall1);
    this.physics.add.collider(character, vwall2);
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
    // increment score
    // change location of paper
    // TODO confine paper to environment
    var x = Math.random() * 800;
    var y = Math.random() * 600;
    paper.setPosition(x, y);
    score++;
    scoreCounter.setText('Score: ' + score);
}
