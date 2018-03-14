class WaitForPlayers extends Phaser.Scene {
  constructor () {
    super({key:'WaitForPlayers'});
  }

  update () {
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

    // display current mouse position
    $('#mouse-position').text('Mouse position: x='+ game.xmouse + ' y=' + game.ymouse);

  }

}











    /*
    // display whether position is valid (nonce not taken)
    if (App.nonceTaken.includes(game.nonce)) {
    $('#mouse-position-valid').text('You are too close to another miner! Choose another location to mine'); //pass on red color format
    } else {
    $('#mouse-position-valid').text('Click to place your miner!'); //pass on green color format
    }



    // get destination coordinates on click if mouse isn't blocked and nonce is valid
    if ( this.input.activePointer.isDown && !game.mouseBlocked && !(App.nonceTaken.includes(game.nonce)) ) {
      // block mouse
      game.mouseBlocked = true;
      // get destination coordinates from current mouse location
      game.xdestination = this.input.activePointer.x;
      game.ydestination = this.input.activePointer.y;

      console.log(game.nonce);
      App.playGame(game.nonce);
      }
    }
  }
} */
