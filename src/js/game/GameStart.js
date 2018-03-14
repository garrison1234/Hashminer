class GameStart extends Phaser.Scene {
  constructor () {
    super({key:'GameStart'});
  }

  preload() {
    this.load.image('background', 'assets/background.png');
    this.load.spritesheet('miner', 'assets/character1/spritesheet1.png',{ frameWidth: 20, frameHeight: 23 });
  }

  create() {

    game.player = this.physics.add.sprite(100, 450, 'miner');
    game.precision = 5;

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
        key: 'down',
        frames: this.anims.generateFrameNumbers('miner', { start: 3, end: 5 }),
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

  update() {

    // get current mouse coordinates
    game.xmouse = this.input.activePointer.x;
    game.ymouse = this.input.activePointer.y;

    // determine game.nonce from current mouse coordinates
    if ( (0 <= game.xmouse) && (game.xmouse <= 240) ) {
      if ( (0 <= game.ymouse) && (game.ymouse <= 135) ) {
        game.nonce = 1;
      }
      if ( (135 < game.ymouse) && (game.ymouse <= 270) ) {
        game.nonce = 2;
      }
      if ( (270 <= game.ymouse) && (game.ymouse <= 405) ) {
        game.nonce = 3;
      }
      if ( (405 < game.ymouse) && (game.ymouse <= 540) ) {
        game.nonce = 4;
      }
    }

    if ( (240 < game.xmouse) && (game.xmouse <= 480) ) {
      if ( (0 <= game.ymouse) && (game.ymouse <= 135) ) {
        game.nonce = 5;
      }
      if ( (135 < game.ymouse) && (game.ymouse <= 270) ) {
        game.nonce = 6;
      }
      if ( (270 <= game.ymouse) && (game.ymouse <= 405) ) {
        game.nonce = 7;
      }
      if ( (405 < game.ymouse) && (game.ymouse <= 540) ) {
        game.nonce = 8;
      }
    }

    if ( (480 < game.xmouse) && (game.xmouse <= 720) ) {
      if ( (0 <= game.ymouse) && (game.ymouse <= 135) ) {
        game.nonce = 9;
      }
      if ( (135 < game.ymouse) && (game.ymouse <= 270) ) {
        game.nonce = 10;
      }
      if ( (270 <= game.ymouse) && (game.ymouse <= 405) ) {
        game.nonce = 11;
      }
      if ( (405 < game.ymouse) && (game.ymouse <= 540) ) {
        game.nonce = 12;
      }
    }

    if ( (720 < game.xmouse) && (game.xmouse <= 960) ) {
      if ( (0 <= game.ymouse) && (game.ymouse <= 135) ) {
        game.nonce = 13;
      }
      if ( (135 < game.ymouse) && (game.ymouse <= 270) ) {
        game.nonce = 14;
      }
      if ( (270 <= game.ymouse) && (game.ymouse <= 405) ) {
        game.nonce = 15;
      }
      if ( (405 < game.ymouse) && (game.ymouse <= 540) ) {
        game.nonce = 16;
      }
    }

    // display current mouse position and whether position is valid (nonce not taken)
    if (App.takenNonces.includes(game.nonce)) {
    $('#mouse-position').text('Mouse position: x='+ game.xmouse + ' y=' + game.ymouse + ' You are too close to another miner! Choose another location to mine');
    } else {
    $('#mouse-position').text('Mouse position: x='+ game.xmouse + ' y=' + game.ymouse + ' click to place miner');
    }

    if ( this.input.activePointer.isDown && !game.mouseBlocked && !(App.takenNonces.includes(game.nonce)) ) {
      // block mouse
      game.mouseBlocked = true;
      // get destination coordinates from current mouse location
      game.xdestination = this.input.activePointer.x;
      game.ydestination = this.input.activePointer.y;

      // HERE THE SERVER SHOULD VALIDATE THAT ANOTHER PLAYER HASN'T CALLED PLAYGAME() WITH THE SAME NONCE. KEEP A MAPPING/ARRAY OF PENDING PLAYERS
      App.playGame(game.nonce, game.xdestination, game.ydestination);
      }

    function newPlayerConfirmed(_nonce, _xdestination, _ydestination) {
      if (_nonce > 0) {
        //add miner to map
        //move miner to desired x coordinate
        if ( Math.abs(player.x - _xdestination) > game.precision) {
          player.setVelocityY(0);
          if ( (player.x - _xdestination) > game.precision) {
            player.setVelocityX(-160);
            player.anims.play('left', true);
          } else if ( (player.x - _xdestination) < -game.precision) {
            player.setVelocityX(160);
            player.anims.play('right', true);
          } else {
            player.setVelocityX(0);
            player.anims.play('left', false);
            player.anims.play('right', false);
          }
        }
        //move miner to desired y coordinate
        if ( Math.abs(player.x - _xdestination) < game.precision) {
          player.setVelocityX(0);
          if ((player.y - _ydestination) > game.precision) {
            player.setVelocityY(-160);
            player.anims.play('up', true);
          } else if ((player.y - _ydestination) < -game.precision) {
            player.setVelocityY(160);
            player.anims.play('down', true);
          } else {
            player.setVelocityY(0);
            player.anims.play('mine', true);
          }
        }
      } else {
        //unblock mouse to allow user to place play
        game.mouseBlocked = false;
      }
    }

  }

}
