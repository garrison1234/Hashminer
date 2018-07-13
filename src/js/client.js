var Client = {};

Client.socket = io.connect();

// received upon connection to server.js, passes array of current confirmed and pending miners
/*Client.socket.on('allPlayers',function(_newPlayers){
  console.log('received allPlayers from server: ' + JSON.stringify(_newPlayers));
    var newConfirmedMiners = [];
    for (let element of _newPlayers) {
      // block all nonces if not already blocked
      game.blockNonce(Number(element.nonce));
      // add property joined:'before' to each confirmed element and push to newConfirmedMiners
      if (!element.pending) {
        element.joined = 'before';
        newConfirmedMiners.push(element);
      }
    }
    // pass newConfirmedMiners to game
    game.addNewMiners(newConfirmedMiners);
});*/

// new unconfirmed nonce selection received from server.js
Client.socket.on('newSelection',function(newSelection){
  console.log('received newSelection from server.js: ' + JSON.stringify(newSelection));
  // block received selection's nonce
  game.blockNonce(newSelection.nonce);
  // add timer to received selection
  newSelection.timer = setTimeout(function() {
    console.log("unblock nonce: " + newSelection.nonce);
    game.unblockNonce(newSelection.nonce);
  }, 60000);
  // push received selection to App.pendingPlayers
  App.pendingPlayers.push(newSelection);
  console.log('App.pendingPlayers: ' + JSON.stringify(App.pendingPlayers));
});

// previously selected nonce was cancelled due to timeout
Client.socket.on('nonceCancelled',function(_nonce){
  console.log('received nonceCancelled from server.js: ' + _nonce);
    game.unblockNonce(_nonce);
});

// new player confirmation from server.js
/*Client.socket.on('newConfirmed',function(_newPlayer){
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
});*/

Client.socket.on('unblockButton',function(){
  console.log('received unblockButton from server.js: ');
  App.revealWinnerModalShow();
});

Client.socket.on('blockButton',function(){
  console.log('received blockButton from server.js: ');
    App.revealWinnerModalHide();
});

/*Client.gameLoaded = function() {
  Client.socket.emit('gameLoaded');
};*/

Client.playGame = function(_nonce, _x, _y) {
  // call to send transaction to blockchain
  var player = {address: App.account, x: _x, y: _y, nonce:_nonce};
  console.log('client.playGame, player: ' + JSON.stringify(player));
  Client.socket.emit('selectNonce', player);
};

Client.revealWinner = function() {
  console.log('client.revealWinner');
  Client.socket.emit('revealWinner');
};

/*Client.animateFinal = function(_winningNonce) {
  console.log('client.animateFinal');
  console.log('call game.animateFinal with winningNonce:' + _winningNonce);
  game.animateFinal(_winningNonce);
  Client.socket.emit('revealWinner');
};*/
