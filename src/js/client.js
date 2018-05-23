var Client = {};

Client.socket = io.connect();

// received upon connection to server.js, passes array of current confirmed and pending miners
Client.socket.on('allPlayers',function(_newPlayers){
  console.log('received allPlayers from server.js: ' + _newPlayers);
    var newConfirmedMiners = [];
    for (let element of _newPlayers) {
      console.log('player nonce: ' + element.nonce);
      // block all nonces if not already blocked
      game.blockNonce(element.nonce);
      // add property joined:'before' to each confirmed element and push to newConfirmedMiners
      if (!element.pending) {
        element.joined = 'before';
        newConfirmedMiners.push(element);
        console.log('newConfirmedMiners: ' + newConfirmedMiners);
      }
    }
    // pass newConfirmedMiners to game
    game.addNewMiners(newConfirmedMiners);
});

// new unconfirmed nonce selection received from server.js
Client.socket.on('newSelection',function(_nonce){
    game.blockNonce(_nonce);
});

// previously selected nonce was cancelled due to timeout
Client.socket.on('nonceCancelled',function(_nonce){
    game.unblockNonce(_nonce);
});

// new player confirmation from server.js
Client.socket.on('newConfirmed',function(_newPlayers){
  var newConfirmedMiners = [];
  // block all the newPlayers nonces and push each newPlayer to confirmedMiners if element.pending = false
  for (let element of _newPlayers) {
    // block all nonces if not already blocked
    game.blockNonce(element.nonce);
    // add property joined:'after' to each confirmed element and push to newConfirmedMiners
    if (!element.pending) {
      element.joined = 'after';
      newConfirmedMiners.push(element);
    }
  }
  // pass newConfirmedMiners to game
  game.addNewMiners(newConfirmedMiners);
  // update game, user and players information
  App.displayAccountInfo();
  App.displayGameInfo();
  App.displayPlayersInfo();
});

Client.socket.on('unblockButton',function(){
    $('#reveal-button').prop('disabled', false);
});

Client.socket.on('blockButton',function(){
    $('#reveal-button').prop('disabled', true);
});

Client.socket.on('winner',function(_winningNonce){
    $('#reveal-button').prop('disabled', true);
    game.animateFinal(_winningNonce);
    // Add timer before calling next function
    setTimeout(game.deleteMiners, 10000);
    // update game, user and players information
    App.displayAccountInfo();
    App.displayGameInfo();
    App.displayPlayersInfo();
});

Client.gameLoaded = function() {
  console.log('client.gameLoaded');
  Client.socket.emit('gameLoaded');
};

Client.playGame = function(_nonce, _x, _y, _address) {
  console.log('client.playGame, nonce: ' + _nonce + ', x: ' + _x + ', y: ' + _y + ' address: ' + _address);
  Client.socket.emit('selectNonce', _nonce, _x, _y, _address);
};

Client.revealWinner = function() {
  console.log('client.revealWinner');
  Client.socket.emit('revealWinner');
};
