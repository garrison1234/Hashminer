var express = require('express');
var app = express();
var server = require('http').Server(app);
var io = require('socket.io').listen(server);
var helper = require("./helper.js")
var Web3 = require('web3');
var contract = require("truffle-contract");


if (typeof web3 !== 'undefined') {
  web3 = new Web3(web3.currentProvider);
} else {
  web3 = new Web3(new Web3.providers.HttpProvider("http://localhost:7545"));
}

web3.eth.getAccounts(console.log)


app.use('/css',express.static(__dirname + '/css'));
app.use('/js',express.static(__dirname + '/js'));
app.use('/assets',express.static(__dirname + '/assets'));
app.use('/fonts',express.static(__dirname + '/fonts'));
//app.use('/',express.static(__dirname + '/'));


app.get('/',function(req,res){
  res.sendFile(__dirname+'/index0.html');
});

server.listen(process.env.PORT || 8081,function(){
  console.log('Listening on '+server.address().port);
  console.log(__dirname);
});

var pendingSelections = []
var confirmedSelections = [];
var pendingTimer;



io.on('connection',function(socket){

  socket.on("gameLoaded",function(){
    socket.emit("allPlayers", pendingSelections.concat(confirmedSelections));

    socket.on("selectNonce", function(data){
      if(helper.nonceValid(pendingSelections.concat(confirmedSelections), data.nonce)){
        pendingSelections.push(data)
        pendingTimer = setInterval(helper.checkConfirmations(),2000);
        socket.broadcast.emit("newSelection",pendingSelections.concat(confirmedSelections));
      }
      //--As long as pendingSelection has one element, listen to blockchain.

    });
  });
  socket.on("debugPlayers", function(){
    console.log(JSON.stringify(pendingSelections.concat(confirmedSelections)))
  })

  socket.on("revealWinner", function(){
    //add internal state stopping submission of button
    if(true) {
      socket.broadcast.emit("blockButton")
      //watch ethereum to get the winner
    }
  });
});
