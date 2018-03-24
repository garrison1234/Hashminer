// phaser game configuration
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
    }
};

var playerMap = new Map(); //Get current players information from getPlayersInfo(), from contract
var player;
var precision = 5;
var xmouse, ymouse;
var nonce;
var xmouseClick, ymouseClick;
var mouseBlocked;
var xdestination, ydestination;
var playerMoving;
var spriteAdded;

// create phaser game instance
var game = new Phaser.Game(config);


  function preload () {
    this.load.image('background', 'assets/mingbg.png');
    this.load.spritesheet('miner', 'assets/character1/spritesheet1.png',{ frameWidth: 20, frameHeight: 23 });
  }

  function create() {

    this.add.image(480, 270, 'background');

    //create animations
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

  function update() {

    // get current mouse coordinates
    xmouse = this.input.activePointer.x;
    ymouse = this.input.activePointer.y;

    // determine nonce from current mouse coordinates
    if ( (0 <= xmouse) && (xmouse <= 240) ) {
      if ( (0 <= ymouse) && (ymouse <= 135) ) {
        nonce = 1;
      }
      if ( (135 < ymouse) && (ymouse <= 270) ) {
        nonce = 2;
      }
      if ( (270 <= ymouse) && (ymouse <= 405) ) {
        nonce = 3;
      }
      if ( (405 < ymouse) && (ymouse <= 540) ) {
        nonce = 4;
      }
    }

    if ( (240 < xmouse) && (xmouse <= 480) ) {
      if ( (0 <= ymouse) && (ymouse <= 135) ) {
        nonce = 5;
      }
      if ( (135 < ymouse) && (ymouse <= 270) ) {
        nonce = 6;
      }
      if ( (270 <= ymouse) && (ymouse <= 405) ) {
        nonce = 7;
      }
      if ( (405 < ymouse) && (ymouse <= 540) ) {
        nonce = 8;
      }
    }

    if ( (480 < xmouse) && (xmouse <= 720) ) {
      if ( (0 <= ymouse) && (ymouse <= 135) ) {
        nonce = 9;
      }
      if ( (135 < ymouse) && (ymouse <= 270) ) {
        nonce = 10;
      }
      if ( (270 <= ymouse) && (ymouse <= 405) ) {
        nonce = 11;
      }
      if ( (405 < ymouse) && (ymouse <= 540) ) {
        nonce = 12;
      }
    }

    if ( (720 < xmouse) && (xmouse <= 960) ) {
      if ( (0 <= ymouse) && (ymouse <= 135) ) {
        nonce = 13;
      }
      if ( (135 < ymouse) && (ymouse <= 270) ) {
        nonce = 14;
      }
      if ( (270 <= ymouse) && (ymouse <= 405) ) {
        nonce = 15;
      }
      if ( (405 < ymouse) && (ymouse <= 540) ) {
        nonce = 16;
      }
    }

    // display current mouse position and whether position is valid (nonce not taken)
    if (App.takenNonces.includes(nonce)) {
      $('#mouse-position').text('Mouse position: x='+ xmouse + ' y=' + ymouse + ' You are too close to another miner! Choose another location to mine');
      } else {
      $('#mouse-position').text('Mouse position: x='+ xmouse + ' y=' + ymouse + ' click to place miner');
    }

    if ( this.input.activePointer.isDown && !mouseBlocked && !(App.takenNonces.includes(nonce)) ) {
      // block mouse
      mouseBlocked = true;
      // get destination coordinates from current mouse location
      xmouseClick = this.input.activePointer.x;
      ymouseClick = this.input.activePointer.y;

      // HERE THE SERVER SHOULD VALIDATE THAT ANOTHER PLAYER HASN'T CALLED PLAYGAME() WITH THE SAME NONCE. KEEP A MAPPING/ARRAY OF PENDING PLAYERS
      App.playGame(nonce, xmouseClick, ymouseClick);
    }

    //animate miner moving to its destination
    if (playerMoving) {
      // place player on map
      if (!spriteAdded) {
        player = this.physics.add.sprite(100, 450, 'miner');
      }
      spriteAdded = true;
      //move miner to desired x coordinate
      if ( Math.abs(player.x - xdestination) > precision) {
        player.setVelocityY(0);
        if ( (player.x - xdestination) > precision) {
          player.setVelocityX(-80);
          player.anims.play('left', true);
        } else if ( (player.x - xdestination) < -precision) {
          player.setVelocityX(80);
          player.anims.play('right', true);
        } else {
          player.setVelocityX(0);
          player.anims.play('left', false);
          player.anims.play('right', false);
        }
      }
      //move miner to desired y coordinate
      if ( Math.abs(player.x - xdestination) < precision) {
        player.setVelocityX(0);
        if ((player.y - ydestination) > precision) {
          player.setVelocityY(-80);
          player.anims.play('up', true);
        } else if ((player.y - ydestination) < -precision) {
          player.setVelocityY(80);
          player.anims.play('down', true);
        } else {
          player.setVelocityY(0);
          player.anims.play('mine', true);
          //miner stops moving
          playerMoving = false;
          //allow other sprites to be added
          spriteAdded = false;
          // unblock mouse so user can add another miner
          mouseBlocked = false;

        }
      }
    }


  }

  game.addNewMiner = function(_nonce, _xdestination, _ydestination) {
      xdestination = _xdestination;
      ydestination = _ydestination;
      playerMoving = true;

  }
