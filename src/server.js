var express = require('express');
var app = express();
var server = require('http').Server(app);
var io = require('socket.io').listen(server);
var helper = require("./helper.js")
var Web3 = require('web3');
var contract = require("truffle-contract");
var fs = require("fs");
var web3
web3 = new Web3(new Web3.providers.HttpProvider("http://localhost:7546"));
hashminerAbi = JSON.parse(fs.readFileSync("../build/contracts/Hashminer.json")).abi

var hashminer = web3.eth.contract(hashminerAbi)
var ins = hashminer.at("0x625b914E3836f1E477aE2E11f8537a94126b8139")
console.log(ins.getGameInfo());



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


function initWeb3() {
  if (typeof web3 !== 'undefined') {
    var web3 = new Web3(web3.currentProvider);
  } else {
    var web3 = new Web3(new Web3.providers.HttpProvider("http://localhost:7545"));
  }
  return web3
}
