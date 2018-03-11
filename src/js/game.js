var config = {
    type: Phaser.AUTO,
    width: 960,
    height: 540,
    parent: 'game',
    physics: {
      default: 'arcade',
      arcade: {
          debug: false
      }
    },
    scene: {
        preload: preload,
        create: create,
        update: update
    },
    confirmPlayer: confirmPlayer
};

var player;
var xdestination, ydestination
var precision = 5;
var nonce;
var playerConfirmed;

var game = new Phaser.Game(config);

function confirmPlayer ()
{
  playerConfirmed = true;
}

function preload ()
{
  this.load.image('background', 'assets/background.png');
  this.load.spritesheet('miner', 'assets/character1/spritesheet1.png',{ frameWidth: 20, frameHeight: 23 });
}

function create () {
  this.add.image(480, 270, 'background');

  player = this.physics.add.sprite(100, 450, 'miner');

  this.anims.create({
      key: 'down',
      frames: this.anims.generateFrameNumbers('miner', { start: 3, end: 5 }),
      frameRate: 10,
      repeat: -1
  });

  this.anims.create({
      key: 'left',
      frames: this.anims.generateFrameNumbers('miner', { start: 9, end: 11 }),
      frameRate: 10,
      repeat: -1
  });

  this.anims.create({
      key: 'right',
      frames: this.anims.generateFrameNumbers('miner', { start: 15, end: 17 }),
      frameRate: 10,
      repeat: -1
  });

  this.anims.create({
      key: 'up',
      frames: this.anims.generateFrameNumbers('miner', { start: 21, end: 23 }),
      frameRate: 10,
      repeat: -1
  });

  this.anims.create({
      key: 'mine',
      frames: this.anims.generateFrameNumbers('miner', { start: 0, end: 2 }),
      frameRate: 4,
      repeat: -1
  });
}

function update () {
  $('#mouse-position').text('Mouse position: x='+ this.input.activePointer.x + ' y=' + this.input.activePointer.y);

  if (this.input.activePointer.isDown) {
    xdestination = this.input.activePointer.x;
    ydestination = this.input.activePointer.y;

    if ( (0 <= xdestination) && (xdestination <= 240) ) {
      if ( (0 <= ydestination) && (ydestination <= 135) ) {
        nonce = 1;
      }
      if ( (135 < ydestination) && (ydestination <= 270) ) {
        nonce = 2;
      }
      if ( (270 <= ydestination) && (ydestination <= 405) ) {
        nonce = 3;
      }
      if ( (405 < ydestination) && (ydestination <= 540) ) {
        nonce = 4;
      }
    }

    if ( (240 < xdestination) && (xdestination <= 480) ) {
      if ( (0 <= ydestination) && (ydestination <= 135) ) {
        nonce = 5;
      }
      if ( (135 < ydestination) && (ydestination <= 270) ) {
        nonce = 6;
      }
      if ( (270 <= ydestination) && (ydestination <= 405) ) {
        nonce = 7;
      }
      if ( (405 < ydestination) && (ydestination <= 540) ) {
        nonce = 8;
      }
    }

    if ( (480 < xdestination) && (xdestination <= 720) ) {
      if ( (0 <= ydestination) && (ydestination <= 135) ) {
        nonce = 9;
      }
      if ( (135 < ydestination) && (ydestination <= 270) ) {
        nonce = 10;
      }
      if ( (270 <= ydestination) && (ydestination <= 405) ) {
        nonce = 11;
      }
      if ( (405 < ydestination) && (ydestination <= 540) ) {
        nonce = 12;
      }
    }

    if ( (720 < xdestination) && (xdestination <= 960) ) {
      if ( (0 <= ydestination) && (ydestination <= 135) ) {
        nonce = 13;
      }
      if ( (135 < ydestination) && (ydestination <= 270) ) {
        nonce = 14;
      }
      if ( (270 <= ydestination) && (ydestination <= 405) ) {
        nonce = 15;
      }
      if ( (405 < ydestination) && (ydestination <= 540) ) {
        nonce = 16;
      }
    }

    console.log(nonce);
    App.playGame(nonce);
  }

  //console.log('xplayer - xdestination: ' + (player.x - xdestination));
  //console.log('yplayer - ydestination: ' + (player.y - ydestination));

  if (playerConfirmed){
    if ( Math.abs(player.x - xdestination) > precision) {
      player.setVelocityY(0);
      if ( (player.x - xdestination) > precision) {
        player.setVelocityX(-160);
        player.anims.play('left', true);
      } else if ( (player.x - xdestination) < -precision) {
        player.setVelocityX(160);
        player.anims.play('right', true);
      } else {
        player.setVelocityX(0);
        player.anims.play('left', false);
        player.anims.play('right', false);
      }
    }

    if ( Math.abs(player.x - xdestination) < precision) {
      player.setVelocityX(0);
      if ((player.y - ydestination) > precision) {
        player.setVelocityY(-160);
        player.anims.play('up', true);
      } else if ((player.y - ydestination) < -precision) {
        player.setVelocityY(160);
        player.anims.play('down', true);
      } else {
        player.setVelocityY(0);
        player.anims.play('mine', true);
      }
    }
  }


}
