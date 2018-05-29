var Client = {};

Client.socket = io.connect();

// received upon connection to server.js, passes array of current confirmed and pending miners
Client.socket.on('allPlayers',function(_newPlayers){
  console.log('received allPlayers from server.js: ' + JSON.stringify(_newPlayers));
    for (let element of _newPlayers) {
      if (!element.pending) {
        element.joined = 'before';
      }
    }
    // pass newConfirmedMiners to game
    game.addNewMiners(_newPlayers);
});

// new unconfirmed nonce selection received from server.js
Client.socket.on('newSelection',function(_nonce){
  console.log('received newSelection from server.js: ' + _nonce);
    game.blockNonce(_nonce);
});

// previously selected nonce was cancelled due to timeout
Client.socket.on('nonceCancelled',function(_nonce){
  console.log('received nonceCancelled from server.js: ' + _nonce);
    game.unblockNonce(_nonce);
});

// new player confirmation from server.js
Client.socket.on('newConfirmed',function(_newPlayer){
  console.log('received newConfirmed from server.js: ' + JSON.stringify(_newPlayer));
  // block nonce if not already blocked
  game.blockNonce(_newPlayer.nonce);
  // add property joined:'after' to the new confirmed player
  _newPlayer.joined = 'after';
  // place _newPlayer to array, since game.addNewMiners pushes array to array
  var newPlayer = [];
  newPlayer[0] = _newPlayer;
  // pass new confirmed player to game
  game.addNewMiners(newPlayer);
});

Client.socket.on('unblockButton',function(){
  console.log('received unblockButton from server.js: ');
    $('#reveal-button').prop('disabled', false);
});

Client.socket.on('blockButton',function(){
  console.log('received blockButton from server.js: ');
    $('#reveal-button').prop('disabled', true);
});

Client.gameLoaded = function() {
  console.log('client.gameLoaded');
  Client.socket.emit('gameLoaded');
  // get user's ETH address and pass to game
  game.setClientAddress(App.account);
};

Client.playGame = function(_x, _y) {
  // call to send transaction to blockchain
  App.playGame();
  var player = {x: _x, y: _y, address: App.account};
  console.log('client.playGame, nonce: ' + JSON.stringify(player));
  Client.socket.emit('selectNonce', player);
};

Client.revealWinner = function() {
  console.log('client.revealWinner');
  Client.socket.emit('revealWinner');
};

Client.animateFinal = function(_winningNonce) {
  console.log('client.animateFinal');
  console.log('call game.animateFinal with winningNonce:' + _winningNonce);
  game.animateFinal(_winningNonce);
  Client.socket.emit('revealWinner');
};
