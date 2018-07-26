var Client = {};

Client.socket = io.connect();

// new unconfirmed nonce selection received from server.js
Client.socket.on('newSelection',function(newSelection){
  console.log('received newSelection from server.js: ' + JSON.stringify(newSelection));
  // block received selection's nonce
  game.blockNonce(newSelection.nonce);
  // add timer to received selection
  newSelection.timer = setTimeout(function() {
    console.log("unblock nonce: " + newSelection.nonce + ", since confirmation timer FINISHED");
    game.unblockNonce(newSelection.nonce);
  }, 120000);
  // push received selection to App.pendingPlayers
  App.pendingPlayers.push(newSelection);
  console.log('App.pendingPlayers after new selection: ' + JSON.stringify(App.pendingPlayers));
});

Client.socket.on('blockButton',function(){
  console.log('received blockButton from server.js: ');
    App.revealWinnerModalHide();
});

Client.playGame = function(_nonce, _x, _y) {
  // call to send transaction to blockchain
  var player = {address: App.account, x: _x, y: _y, nonce:_nonce};
  console.log('client.playGame, player: ' + JSON.stringify(player));
  Client.socket.emit('selectNonce', player);
};

Client.revealWinner = function() {
  //console.log('client.revealWinner');
  Client.socket.emit('revealWinner');
};
