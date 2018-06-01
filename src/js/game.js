// phaser game configuration
var config = {
    type: Phaser.AUTO,
    width: 960,
    height: 540,
    parent: 'game',
    antialiasing: false,
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

var clientAddress;
var minerCounter = 0;
var precision = 3;
var cursorArea;
var mapAreaValid;
var xmouse, ymouse;
var xmouseClick, ymouseClick;
var xdestination, ydestination;
var mouseBlocked;
var minerMoving;
var blockedNonces = [];
var confirmedMiners = [];
var style = { font: "16px Lucida Console", fill: "#00FF00", wordWrap: true, wordWrapWidth: 20, align: "center" };
var minerText = [];
var activeMiners = [];
var mapNonce;
var gameOver = false;
var deletingMiners = false;
var winningNonce;
var confirmedXcoordinates = [];
var confirmedYcoordinates = [];

// create phaser game instance
var game = new Phaser.Game(config);

  function preload () {

    this.load.image('background', '/assets/bgfinal.png');
    this.load.image('cursorAllowed', '/assets/cursorArea.png');
    this.load.image('cursorBlocked', '/assets/cursorBlocked.png');
    this.load.image('loading', '/assets/loading.png');
    this.load.spritesheet('loading', '/assets/loading.png', { frameWidth: 32, frameHeight: 32 });

    for (var i = 1; i <= 16; i++){
      minerNumber = i.toString();
      this.load.spritesheet( ('miner' + minerNumber), ('/assets/sheet' + minerNumber + '.png'), { frameWidth: 20, frameHeight: 23 });
      this.load.spritesheet( ('minerwin' + minerNumber), ('/assets/winsheet' + minerNumber + '.png'), { frameWidth: 20, frameHeight: 37 });
    }

  }

  function create() {

    this.add.image(480, 270, 'background');

    cursorArea = this.add.sprite(0, 0, 'cursorBlocked');


    // create loading animations
    this.anims.create({
        key: ('playerMinerLoading'),
        frames: this.anims.generateFrameNumbers('loading', { start: 0, end: 3 }),
        frameRate: 10,
        repeat: -1
    });

    this.anims.create({
        key: ('otherMinerLoading'),
        frames: this.anims.generateFrameNumbers('loading', { start: 4, end: 7 }),
        frameRate: 10,
        repeat: -1
    });

    this.anims.create({
        key: ('cannotPlaceMiner'),
        frames: this.anims.generateFrameNumbers('loading', { start: 8, end: 11 }),
        frameRate: 10,
        repeat: -1
    });

    // create miner animations
    for (var j = 1; j <= 16; j++){

      minerNumber = j.toString();

      this.anims.create({
          key: ('left' + minerNumber),
          frames: this.anims.generateFrameNumbers(('miner' + minerNumber), { start: 3, end: 5 }),
          frameRate: 10,
          repeat: -1
      });

      this.anims.create({
          key: ('right' + minerNumber),
          frames: this.anims.generateFrameNumbers(('miner' + minerNumber), { start: 0, end: 2 }),
          frameRate: 10,
          repeat: -1
      });

      this.anims.create({
          key: ('up' + minerNumber),
          frames: this.anims.generateFrameNumbers(('miner' + minerNumber), { start: 6, end: 8 }),
          frameRate: 10,
          repeat: -1
      });

      this.anims.create({
          key: ('down' + minerNumber),
          frames: this.anims.generateFrameNumbers(('miner' + minerNumber), { start: 9, end: 11 }),
          frameRate: 10,
          repeat: -1
      });

      this.anims.create({
          key: ('mine' + minerNumber),
          frames: this.anims.generateFrameNumbers(('miner' + minerNumber), { start: 18, end: 20 }),
          frameRate: 4,
          repeat: -1
      });

      this.anims.create({
          key: ('lose' + minerNumber),
          frames: this.anims.generateFrameNumbers(('miner' + minerNumber), { start: 24, end: 24 }),
          frameRate: 4,
          repeat: -1
      });

      this.anims.create({
          key: ('win' + minerNumber),
          frames: this.anims.generateFrameNumbers(('minerwin' + minerNumber), {frames:[8, 7, 6]}),
          frameRate: 4,
          repeat: -1
      });

    }

    // ask server.js to send current players information
    Client.gameLoaded();
  }

  function update() {

    // get current mouse coordinates. Coordinates vary in 20s in x and 23s in y
    xmouse = 20 * Math.floor(this.input.activePointer.x / 20);
    ymouse = 23 * Math.floor(this.input.activePointer.y / 23);

    // determine nonce from current mouse coordinates
    if ( (0 <= xmouse) && (xmouse <= 240) ) {
      if ( (0 <= ymouse) && (ymouse <= 135) ) {
        mapNonce = 0;
      }
      if ( (135 < ymouse) && (ymouse <= 270) ) {
        mapNonce = 1;
      }
      if ( (270 <= ymouse) && (ymouse <= 405) ) {
        mapNonce = 2;
      }
      if ( (405 < ymouse) && (ymouse <= 540) ) {
        mapNonce = 3;
      }
    }

    if ( (240 < xmouse) && (xmouse <= 480) ) {
      if ( (0 <= ymouse) && (ymouse <= 135) ) {
        mapNonce = 4;
      }
      if ( (135 < ymouse) && (ymouse <= 270) ) {
        mapNonce = 5;
      }
      if ( (270 <= ymouse) && (ymouse <= 405) ) {
        mapNonce = 6;
      }
      if ( (405 < ymouse) && (ymouse <= 540) ) {
        mapNonce = 7;
      }
    }

    if ( (480 < xmouse) && (xmouse <= 720) ) {
      if ( (0 <= ymouse) && (ymouse <= 135) ) {
        mapNonce = 8;
      }
      if ( (135 < ymouse) && (ymouse <= 270) ) {
        mapNonce = 9;
      }
      if ( (270 <= ymouse) && (ymouse <= 405) ) {
        mapNonce = 10;
      }
      if ( (405 < ymouse) && (ymouse <= 540) ) {
        mapNonce = 11;
      }
    }

    if ( (720 < xmouse) && (xmouse <= 960) ) {
      if ( (0 <= ymouse) && (ymouse <= 135) ) {
        mapNonce = 12;
      }
      if ( (135 < ymouse) && (ymouse <= 270) ) {
        mapNonce = 13;
      }
      if ( (270 <= ymouse) && (ymouse <= 405) ) {
        mapNonce = 14;
      }
      if ( (405 < ymouse) && (ymouse <= 540) ) {
        mapNonce = 15;
      }
    }

    // determine if mouse position is valid for adding new miner
    if ( (ymouse < 80) || (ymouse > 460) || (xmouse < 80) || (xmouse > 880) ) {
      mapAreaValid = false;
    } else {
      mapAreaValid = true;
    }

    // update cursor coordinates. The offset is due to dimensions of the cursor area square
    cursorArea.x = xmouse + 10;
    cursorArea.y = ymouse + 12;
    // turn cursor red if in area that isn't allowed. Turn gray is allowed.
    if ( (blockedNonces.includes(mapNonce)) || !mapAreaValid) {
      cursorArea.destroy();
      cursorArea = this.add.sprite(cursorArea.x, cursorArea.y, 'cursorBlocked');
    } else {
      cursorArea.destroy();
      cursorArea = this.add.sprite(cursorArea.x, cursorArea.y, 'cursorAllowed');
    }

    // display current mouse position and whether position is valid (mapNonce not blocked)
    if (blockedNonces.includes(mapNonce)) {
      $('#mouse-position').text('Mouse position: x='+ xmouse + ' y=' + ymouse + ' This location is already taken or pending confirmation, chose another place to mine');
    } else if (!mapAreaValid){
      $('#mouse-position').text('Mouse position: x='+ xmouse + ' y=' + ymouse + ' invalid location, chose another place to mine');
    } else {
      $('#mouse-position').text('Mouse position: x='+ xmouse + ' y=' + ymouse + ' click to place miner');
    }

    if ( !mouseBlocked && this.input.activePointer.isDown && !(blockedNonces.includes(mapNonce)) && !gameOver && mapAreaValid) {
      // block mouse
      mouseBlocked = true;

      // get destination coordinates from current mouse location
      xmouseClick = this.input.activePointer.x;
      ymouseClick = this.input.activePointer.y;

      // call to send transaction information to server.js
      Client.playGame(mapNonce, xmouseClick, ymouseClick);

      // block mouse for 3 seconds to avoid sending transaction twice
      setTimeout(function() { mouseBlocked = false}, 3000);
    }

    if ( (confirmedMiners.length > minerCounter) && !minerMoving && !gameOver ) {

      // define the destination coordinates
      xdestination = confirmedMiners[minerCounter].x;
      ydestination = confirmedMiners[minerCounter].y;
      var newMinerAddress
      if (confirmedMiners[minerCounter].address == clientAddress ) {
          newMinerAddress = 'You';
      } else {
          newMinerAddress = confirmedMiners[minerCounter].address.substring(0, 6) + '...';
      }

      if (confirmedMiners[minerCounter].joined == 'before') {
          activeMiners[minerCounter] = this.physics.add.sprite(xdestination, ydestination, ('miner' + ((minerCounter + 1).toString())))
          minerText[minerCounter] = this.add.text(xdestination, ydestination, newMinerAddress, style);
      } else {
          activeMiners[minerCounter] = this.physics.add.sprite(509, 0, ('miner' + ((minerCounter + 1).toString())))
          minerText[minerCounter] = this.add.text(509, 0, newMinerAddress, style);
      }

      minerMoving = true;
    }

    //animate miner moving to its destination
    if (minerMoving) {
      // save moving miner object in movingMiner
      var movingMiner = activeMiners[minerCounter];

      // animate miner text along with the miner sprite
      minerText[minerCounter].x = Math.floor(movingMiner.x - 14);
      minerText[minerCounter].y = Math.floor(movingMiner.y + 12);


      //move miner to desired x coordinate
      if ( (Math.abs(movingMiner.y - ydestination)) > precision ) {
        movingMiner.setVelocityX(0);
        if ( (movingMiner.y - ydestination) > precision) {
          movingMiner.setVelocityY(-80);
          movingMiner.anims.play(('up' + ((minerCounter + 1).toString())), true);
        } else if ( (movingMiner.y - ydestination) < -precision) {
          movingMiner.setVelocityY(80);
          movingMiner.anims.play(('down' + ((minerCounter + 1).toString())), true);
        } else {
          movingMiner.setVelocityY(0);
          movingMiner.anims.play(('up' + ((minerCounter + 1).toString())), false);
          movingMiner.anims.play(('down' + ((minerCounter + 1).toString())), false);
          movingMiner.y = Math.round(movingMiner.y);
        }
      }
      //move miner to desired y coordinate
      if ( (Math.abs(movingMiner.y - ydestination)) < precision ) {
        movingMiner.setVelocityY(0);
        if ((movingMiner.x - xdestination) > precision) {
          movingMiner.setVelocityX(-80);
          movingMiner.anims.play(('left' + ((minerCounter + 1).toString())), true);
        } else if ((movingMiner.x - xdestination) < -precision) {
          movingMiner.setVelocityX(80);
          movingMiner.anims.play(('right' + ((minerCounter + 1).toString())), true);
        } else {
          movingMiner.setVelocityX(0);
          movingMiner.x = Math.round(movingMiner.x);
          movingMiner.anims.play(('mine' + ((minerCounter + 1).toString())), true);
          // increase minerCounter
          minerCounter++;
          // miner stops moving
          minerMoving = false;
        }
      }
    }

    // Replace all miners with losers/winning animations
    if (gameOver) {
      for (var l = 0; l <= 3; l++) {
        var element = activeMiners[l];
        element.disableBody(true, true);
        console.log('confirmedMiners[' + l + ']: ' + confirmedMiners[l].nonce + ', ' + 'winningNonce: ' + winningNonce);
        if (confirmedMiners[l].nonce == winningNonce) {
            activeMiners[l] = this.physics.add.sprite(confirmedXcoordinates[l], confirmedYcoordinates[l], ('minerwin' + ((l + 1).toString())))
            activeMiners[l].anims.play(('win' + ((l + 1).toString())), true);
        } else {
          activeMiners[l] = this.physics.add.sprite(confirmedXcoordinates[l], confirmedYcoordinates[l], ('miner' + ((l + 1).toString())))
          activeMiners[l].anims.play(('lose' + ((l + 1).toString())), true);
        }
      }
      setTimeout(function() { deletingMiners = true}, 10000);
      gameOver = false;
    }

    // delete all sprites from map
    if (deletingMiners) {
      for (var l = 0; l <= 3; l++) {
        var element = activeMiners[l];
        var elementText = minerText[l];
        element.disableBody(true, true);
        elementText.destroy();
      }
      minerCounter = 0;
      blockedNonces = [];
      confirmedMiners = [];
      activeMiners = [];
      confirmedXcoordinates = [];
      confirmedYcoordinates = [];
      deletingMiners = false;
    }

  }

  // set client's ETH address
  game.setClientAddress = function(_clientAddress) {
      clientAddress = _clientAddress;
  }

  // function called from app.js to add array of new confirmed player objects{nonce, x, y, address} sent from server.js
  game.addNewMiners = function(newPlayers) {
      // add newPlayers array to confirmedMiners array
      Array.prototype.push.apply(confirmedMiners, newPlayers);
  }

  // function called from app.js to block nonces already played, confirmed or in the process of being confirmed
  game.blockNonce = function(blockedNonce) {
    // add nonce to blockedNonces only if not already included
    var nonceIndex = blockedNonces.indexOf(blockedNonce);
    if (nonceIndex = -1) {
      blockedNonces.push(blockedNonce);
    }
  }

  // function called from app.js to unblock nonces that were played but not confirmed in time
  game.unblockNonce = function(unblockedNonce) {
    // remove nonce from blockedNonces only if already included
    var nonceIndex = blockedNonces.indexOf(unblockedNonce);
    if (nonceIndex > -1) {
      blockedNonces.splice(nonceIndex, 1);
    }
  }

  game.unblockMouse = function() {
    mouseBlocked = false;
  }

  game.animateFinal = function(_winningNonce) {
    console.log('game.animateFinal, _winningNonce:' + _winningNonce);
    confirmedXcoordinates = confirmedMiners.map(a => a.x);
    confirmedYcoordinates = confirmedMiners.map(a => a.y);
    winningNonce = _winningNonce;
    gameOver = true;
  }

  game.deleteMiners = function() {
    deletingMiners = true;
  }
