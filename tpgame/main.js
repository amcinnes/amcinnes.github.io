var config = {
    physics: {
        default: 'arcade'
    },
    scene: {
        preload: preload,
        create: create,
        update: update
    },
    scale: {
        mode: Phaser.Scale.FIT,
        autoCenter: Phaser.Scale.CENTER_BOTH,
        width: 800,
        height: 600,
        parent: 'container',
        max: {
          width: 800,
          height: 600
        }
    },
    expandParent: false
};

var game = new Phaser.Game(config);

var intro;
var running = false;
var cursors;
var character;
var scoreCounter;
var score = 0;
var obstacles;
var enemies = [];
var enemies_per_millisecond;
var dead = false;
var pointer = null;

const CHARACTER_SPEED=200;
const ENEMY_SPEED=250;

function setScore(s) {
    score = s;
    scoreCounter.setText('Score: ' + score);
    outroScoreCounter.setText(score);
}

function preload () {
    this.load.image('character', 'character.png');
    this.load.image('paper', 'paper.png');
    this.load.image('background', 'background.png');
    this.load.image('intro', 'intro.png');
    this.load.image('outro', 'outro.png');
    this.load.image('shelf1', 'shelf1.png');
    this.load.image('shelf2', 'shelf2.png');
    this.load.image('shelf3', 'shelf3.png');
    this.load.image('shelf4', 'shelf4.png');
    this.load.image('shelf5', 'shelf5.png');
    this.load.image('hwall', 'hwall.png');
    this.load.image('vwall', 'vwall.png');
    this.load.image('enemy_l', 'enemy_l.png');
    this.load.image('enemy_r', 'enemy_r.png');
    this.load.image('enemy_d', 'enemy_d.png');
    this.load.spritesheet('explosion', 'explosion.png', { frameWidth: 64, frameHeight: 64, endFrame: 23 });
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

    this.anims.create({
        key: 'explode',
        frames: this.anims.generateFrameNumbers('explosion', { start: 0, end: 23, first: 23 }),
        frameRate: 15
    });
    character = this.physics.add.image(400, 300, 'character');
    character.setSize(38, 78, true);
    paper = this.physics.add.image(400, 300, 'paper');
    paper.setSize(70, 50, true);
    this.physics.add.overlap(character, paper, collectPaper, null, this);
    this.physics.add.collider(character, obstacles);
    scoreCounter = this.add.text(6, 3, '', { fontFamily: 'Arial', fontSize: 18, color: '#ffffff' });

    intro = this.add.image(400, 300, 'intro');
    outro = this.add.image(400, 300, 'outro');
    outro.visible = false;
    outroScoreCounter = this.add.text(275, 155, '0', { fontFamily: 'Arial', fontSize: 30, color: '#000000' });
    outroScoreCounter.visible = false;

    this.input.keyboard.on('keydown_ENTER', startGame);
    this.input.on('pointerdown', function(p) {
      pointer = p;
      startGame()
    });
    this.input.on('pointerup', function() {
      pointer = null;
    });
}

function startGame(event) {
    if (!running) {
        running = true;
        intro.visible = false;
        outro.visible = false;
        outroScoreCounter.visible = false;
        // Prepare the game
        dead = false;
        character.visible = true;
        enemies_per_millisecond = 1/2000;
        placePaper();
        character.setPosition(400, 300);
        setScore(0);
    }
}

function update(time, delta) {
    character.setVelocity(0);
    if (running) {
        if (dead) {
            deadTime += delta;
            if (deadTime > 3000) {
                // after the explosion finishes
                running = false;
                outro.visible = true;
                outroScoreCounter.visible = true;
                // delete all the enemies
                for (var i=0; i<enemies.length; i++) {
                    enemies[i].obj.destroy();
                }
                enemies = [];

            }
        } else  {
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
            if (pointer) {
              var M = 10;
              if (pointer.x < character.x - M) {
                character.setVelocityX(-CHARACTER_SPEED);
              } else if (pointer.x > character.x + M) {
                character.setVelocityX(CHARACTER_SPEED);
              }
              if (pointer.y < character.y - M) {
                character.setVelocityY(-CHARACTER_SPEED);
              } else if (pointer.y > character.y + M) {
                character.setVelocityY(CHARACTER_SPEED);
              }
            }
        }
    }
    if (running) {
        // Create enemies at a gradually increasing rate
        if (Math.random() < enemies_per_millisecond * delta) {
            createEnemy(this.physics);
        }
        enemies_per_millisecond += 1e-8 * delta;

        var next_enemies = [];
        for (var i=0; i<enemies.length; i++) {
            enemies[i].age += delta;
            if (enemies[i].age > 1000) {
                // If it was created more than n steps ago, set its velocity appropriately
                switch (enemies[i].type) {
                case 'left':
                    enemies[i].obj.setVelocityX(-ENEMY_SPEED);
                    break;
                case 'right':
                    enemies[i].obj.setVelocityX(ENEMY_SPEED);
                    break;
                case 'down':
                    enemies[i].obj.setVelocityY(ENEMY_SPEED);
                    break;
                }
            }
            // If it has left the arena, remove it
            var o = enemies[i].obj;
            if (o.x>900 || o.x<-100 || o.y>700) {
                o.destroy();
            } else {
                next_enemies.push(enemies[i]);
            }
        }
        enemies = next_enemies;
    }
}

function choose_x() {
    var choices = [65, 280, 510, 725];
    return choices[Math.floor(Math.random()*choices.length)];
}

function choose_y() {
    var choices = [80, 305, 515];
    return choices[Math.floor(Math.random()*choices.length)];
}

function collectPaper(player, paper) {
    placePaper();
    setScore(score + 1);
}

function placePaper() {
    // Put paper on one of these lines that doesn't overlap with obstacles
    // I'd be happy to just create it in any random location that doesn't overlap with obstacles
    // but can't figure out how to do that easily
    if (Math.random() >= 0.5) {
        var x = choose_x();
        var y = Math.random() * (560-40) + 40;
        paper.setPosition(x, y);
    } else {
        var x = Math.random() * (760-40) + 40;
        var y = choose_y();
        paper.setPosition(x, y);
    }
}

function createEnemy(physics) {
    var r = Math.random();
    var type;
    var image_name;
    var x;
    var y;
    var size_x;
    var size_y;
    var offset_x;
    var offset_y;
    if (r < 0.25) {
        type = 'left';
        image_name = 'enemy_l';
        x = 825;
        y = choose_y();
        size_x = 61;
        offset_x = 0;
        size_y = 40;
        offset_y = 38;
    } else if (r < 0.5) {
        type = 'right';
        image_name = 'enemy_r';
        x = -25;
        y = choose_y();
        size_x = 61;
        offset_x = 36;
        size_y = 40;
        offset_y = 38;
    } else {
        type = 'down';
        image_name = 'enemy_d';
        x = choose_x();
        y = -25;
        size_x = 68;
        offset_x = 2;
        size_y = 51;
        offset_y = 40;
    }
    var obj = physics.add.image(x, y, image_name).setSize(size_x, size_y).setOffset(offset_x, offset_y);
    physics.add.overlap(character, obj, hitEnemy, null, null);
    enemies.push({
        age: 0,
        type: type,
        obj: obj
    });
}

function hitEnemy() {
    if (!dead) {
        // disable controls and set player velocity to 0
        dead = true;
        deadTime = 0;
        character.visible = false;
        // play an explosion
        var boom = character.scene.add.sprite(character.x, character.y, 'boom').setScale(2);
        boom.anims.play('explode');
    }
}
