/*


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
} */
