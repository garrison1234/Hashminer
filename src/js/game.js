// phaser game configuration
var config = {
    type: Phaser.AUTO,
    width: 960,
    height: 560,
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

var web3LoadTimer;
var newPlayers = [];
var minerCounter = 0;
var precision = 3;
var cursorArea;
var instructionsText;
var coordinatesText;
var mapAreaValid;
var xmouse, ymouse;
var mouseBlocked;
var blockedNonces = [];
var confirmedMiners = [16];
var mapNonce;
var gameFull = false;
var gameOver = false;
var animatingFinal = false;
var deletingMiners = false;
var winningNonce;

// create phaser game instance
var game = new Phaser.Game(config);

//  The Google WebFont Loader will look for this object, so create it before loading the script.
WebFontConfig = {

    //  'active' means all requested fonts have finished loading
    //  We set a 1 second delay before calling 'createText'.
    //  For some reason if we don't the browser cannot render the text the first time it's created.
    //active: function() { this.time.events.add(Phaser.Timer.SECOND, createText, this); },

    //  The Google Fonts we want to load (specify as many as you like in the array)
    google: {
      families: ['Aldrich']
    }

};

  function preload () {

    this.load.script(
    'webfont',
    '//ajax.googleapis.com/ajax/libs/webfont/1.4.7/webfont.js'
    );

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

    this.add.image(480, 280, 'background');

    cursorArea = this.add.sprite(0, 0, 'cursorBlocked');

    instructionsText = this.add.text(8, 560, '', { font: "12px Aldrich", fill: "#00FF00", wordWrap: true, wordWrapWidth: 20, align: "center" });
    coordinatesText = this.add.text(8, 8, '', { font: "12px Aldrich", fill: "#00FF00", wordWrap: true, wordWrapWidth: 20, align: "center" });

    /*// create loading animations
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
    });*/

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

    // start timer to let web3 information load (syncronicity problems with account information)
    /*setTimeout( () => {
      web3LoadTimer = true;
      // ask server.js to send current players information
      Client.gameLoaded();
    }, 1000);*/

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
    if (!gameOver && !gameFull && !animatingFinal) {
      if (!mapAreaValid){
        instructionsText.destroy();
        instructionsText = this.add.text(330, 545, 'Invalid location. Choose another place to mine',
        { font: "12px Aldrich", fill: "#DC143C", wordWrap: true, wordWrapWidth: 20, align: "center" });
      } else if (blockedNonces.includes(mapNonce)) {
        instructionsText.destroy()
        instructionsText = this.add.text(220, 545, 'This location is already taken or pending confirmation. choose another location to mine',
        { font: "12px Aldrich", fill: "#DC143C", wordWrap: true, wordWrapWidth: 20, align: "center" });
      } else {
        instructionsText.destroy()
        instructionsText = this.add.text(375, 545, 'Map area: ' + mapNonce + '. Click to place miner!',
        { font: "12px Aldrich", fill: "#00FF00", wordWrap: true, wordWrapWidth: 20, align: "center" });
      }
    }

    if ( !mouseBlocked && this.input.activePointer.isDown && !(blockedNonces.includes(mapNonce)) && !gameOver && !deletingMiners && mapAreaValid) {
      // block mouse
      mouseBlocked = true;

      // call to generate transaction
      App.playGame(mapNonce);

      //push to pending players
      var newLocalPlayer = {address: App.account, x:xmouse, y:ymouse, nonce:mapNonce};
      newLocalPlayer.timer = setTimeout(function() {
        console.log("unblock nonce: " + newLocalPlayer.nonce);
        game.unblockNonce(newLocalPlayer.nonce);
      }, 60000);
      // push received selection to App.pendingPlayers
      App.pendingPlayers.push(newLocalPlayer);

      //block nonce on map
      game.blockNonce(mapNonce);

      // call to send transaction information to server.js
      Client.playGame(mapNonce, xmouse, ymouse);

      // block mouse for 3 seconds to avoid sending transaction twice
      setTimeout(function() { mouseBlocked = false}, 1000);
    }

    // move each element of newPlayers to confirmedMiners and create sprites and text for each
    newPlayers.forEach( (element, index) => {
      confirmedMiners[minerCounter] = {};
      // define the destination coordinates
      confirmedMiners[minerCounter].xdestination = element.x;
      confirmedMiners[minerCounter].ydestination = element.y;
      confirmedMiners[minerCounter].nonce = element.nonce;
      confirmedMiners[minerCounter].address = element.address;
      if (element.address.toLowerCase() == App.account ) {
          confirmedMiners[minerCounter].addressShort = 'You';
      } else {
          confirmedMiners[minerCounter].addressShort = element.address.substring(0, 6) + '...';
      }

      if (element.joined == 'before') {
        confirmedMiners[minerCounter].moving = false;
        confirmedMiners[minerCounter].sprite = this.physics.add.sprite(element.x, element.y, ('miner' + ((minerCounter + 1).toString())));
        confirmedMiners[minerCounter].text = this.add.text((element.x + 12), element.y, confirmedMiners[minerCounter].addressShort,
          { font: "12px Aldrich", fill: "#049AC5", wordWrap: true, wordWrapWidth: 20, align: "center" });
        confirmedMiners[minerCounter].sprite.anims.play(('mine' + ((index + 1).toString())), true);
      } else {
        confirmedMiners[minerCounter].moving = true;
        confirmedMiners[minerCounter].sprite = this.physics.add.sprite(509, 0, ('miner' + ((minerCounter + 1).toString())))
        confirmedMiners[minerCounter].text = this.add.text(509, 0, confirmedMiners[minerCounter].addressShort,
          { font: "12px Aldrich", fill: "	#049AC5", wordWrap: true, wordWrapWidth: 20, align: "center" });
      }
      minerCounter++;
      if(minerCounter == 16) {
        gameFull = true;
      }
    });

    // empty newPlayers array after adding them to map
    newPlayers = [];

    //animate all miners to their destinations
    confirmedMiners.forEach( (element, index) => {
      if(element.moving){
        // animate miner text along with the miner sprite
        element.text.x = Math.floor(element.sprite.x + 12);
        element.text.y = Math.floor(element.sprite.y);


        //move miner to desired x coordinate
        if ( (Math.abs(element.sprite.y - element.ydestination)) > precision ) {
          element.sprite.setVelocityX(0);
          if ( (element.sprite.y - element.ydestination) > precision) {
            element.sprite.setVelocityY(-80);
            element.sprite.anims.play(('up' + ((index + 1).toString())), true);
          } else if ( (element.sprite.y - element.ydestination) < -precision) {
            element.sprite.setVelocityY(80);
            element.sprite.anims.play(('down' + ((index + 1).toString())), true);
          } else {
            element.sprite.setVelocityY(0);
            element.sprite.anims.play(('up' + ((index + 1).toString())), false);
            element.sprite.anims.play(('down' + ((index + 1).toString())), false);
            element.sprite.y = Math.round(element.sprite.y / 23) * 23 + 12;
          }
        } else {
          //move miner to desired y coordinate
          if ( (Math.abs(element.sprite.y - element.ydestination)) < precision ) {
            element.sprite.setVelocityY(0);
            if ((element.sprite.x - element.xdestination) > precision) {
              element.sprite.setVelocityX(-80);
              element.sprite.anims.play(('left' + ((index + 1).toString())), true);
            } else if ((element.sprite.x - element.xdestination) < -precision) {
              element.sprite.setVelocityX(80);
              element.sprite.anims.play(('right' + ((index + 1).toString())), true);
            } else {
              element.sprite.setVelocityX(0);
              //console.log('element.sprite.x: ' + element.sprite.x);
              element.sprite.x = Math.round(element.sprite.x / 20) * 20 + 10;
              element.sprite.y = Math.round(element.sprite.y / 23) * 23 + 12;
              element.text.x = Math.floor(element.sprite.x + 12);
              //console.log('element.sprite.x: ' + element.sprite.x);
              element.sprite.anims.play(('mine' + ((index + 1).toString())), true);
              // miner stops moving
              element.moving = false;
            }
          }

        }

      }
    });
    if (gameFull && !gameOver) {
      instructionsText.destroy();
      instructionsText = this.add.text(330, 520, 'Game is full. Waiting for winner to be revealed!',
      { font: "12px Aldrich", fill: "#00FF00", wordWrap: true, wordWrapWidth: 20, align: "center" });
    }

    // Replace all miners with losers/winning animations
    if (gameOver) {
      gameFull = false;
      instructionsText.destroy();
      confirmedMiners.forEach( (element, index) => {
        element.sprite.disableBody(true, true);
        if(element.nonce == winningNonce) {
          instructionsText = this.add.text(200, 520, 'Game finished. ' + 'User ' + element.address
          + 'wins with nonce: ' + element.nonce + '!',
          { font: "12px Aldrich", fill: "#00FF00", wordWrap: true, wordWrapWidth: 20, align: "center" });
          element.sprite = this.physics.add.sprite(element.xdestination, element.ydestination, ('minerwin' + ((index + 1).toString())))
          console.log('winning sprite:' + element.sprite);
          element.sprite.anims.play(('win' + ((index + 1).toString())), true);
        } else {
          console.log('losing sprite:' + element.sprite);
          element.sprite = this.physics.add.sprite(element.xdestination, element.ydestination, ('miner' + ((index + 1).toString())))
          element.sprite.anims.play(('lose' + ((index + 1).toString())), true);
        }
      });
      setTimeout(function() { deletingMiners = true;}, 20000);
      gameOver = false;
      animatingFinal = true;
    }

    // delete all sprites from map
    if (deletingMiners) {
      confirmedMiners.forEach( element => {
        element.sprite.disableBody(true, true);
        element.text.destroy();
      });
      minerCounter = 0;
      blockedNonces = [];
      confirmedMiners = [];
      deletingMiners = false;
      gameFull = false;
      animatingFinal = false;
    }

  }

  // receives player object{address, x, y, nonce} and pushes to newPlayers array sent from server.js
  game.addNewMiner = function(receivedPlayer) {
      // add receivedPlayers array to newPlayers array
      newPlayers.push(receivedPlayer);
      console.log(newPlayers);
  }

  // block nonce
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

  game.animateFinal = function(_winningNonce) {
    console.log('game.animateFinal, _winningNonce:' + _winningNonce);
    winningNonce = _winningNonce;
    gameOver = true;
  }

  game.deleteMiners = function() {
    deletingMiners = true;
  }
