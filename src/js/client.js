var Client = {};
Client.socket = io.connect();

Client.socket.on('allPlayers',function(_newPlayers){
    game.addActiveMiners(_newPlayers);
});

Client.playGame = function(_nonce, _x, _y, _address) {
  console.log('client.playGame');
  Client.socket.emit('selectNonce', _nonce, _x, _y, _address);
};

Client.socket.on('newSelection',function(_nonce){
    game.blockNonce(_nonce);
});

Client.socket.on('nonceCancelled',function(_nonce){
    game.unblockNonce(_nonce);
});

Client.socket.on('nonceConfirmed',function(_newPlayers){
    game.blockNonce(_newPlayers);
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
    // ADD timer, then add alert window, before calling next function
    game.deleteMiners();
    App.displayAccountInfo();
    App.displayGameInfo();
    App.displayPlayersInfo();
});
