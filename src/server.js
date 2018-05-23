var express = require('express');
var app = express();
var server = require('http').Server(app);
var io = require('socket.io').listen(server);
var helper = require("./helper.js")
var Web3 = require('web3');
var contract = require("truffle-contract");
var fs = require("fs");
var web3
web3 = new Web3(new Web3.providers.HttpProvider("http://localhost:7545"));

app.use('/css',express.static(__dirname + '/css'));
app.use('/js',express.static(__dirname + '/js'));
app.use('/assets',express.static(__dirname + '/assets'));
app.use('/fonts',express.static(__dirname + '/fonts'));
//app.use('/',express.static(__dirname + '/'));
app.use('/build',express.static(__dirname+ '/build'));
app.use('/contracts',express.static(__dirname+ '/contracts'));

app.get('/',function(req,res){
  res.sendFile(__dirname+'/index0.html');
});

server.listen(process.env.PORT || 8081,function(){
  console.log('Listening on '+server.address().port);
});
var debug = true
var pendingSelections = []
var confirmedSelections = [];
var gameInfo = [];
var hashminerAbi = JSON.parse(fs.readFileSync("../build/contracts/Hashminer.json")).abi
var hashminer = web3.eth.contract(hashminerAbi)
var address = "0x625b914e3836f1e477ae2e11f8537a94126b8139"
var instance = hashminer.at(address.toLowerCase())
confirmedSelections = helper.loadStartingState(instance.getPlayersInfo())
gameInfo = instance.getGameInfo()
drawBlock = gameInfo[5]
maxPlayers = gameInfo[2].toNumber()
currentBlock = web3.eth.blockNumber
console.log("current : " + currentBlock);
console.log("drawBlock : " + drawBlock);


var PlayEvent = instance.LogPlayerAdded({},{fromBlock:"latest",toBlock:"latest"})
PlayEvent.watch(function(err,res) {
  if(!err){
    var playEvent = {address:res.args._wallet.toLowerCase(),nonce:res.args._nonce.toNumber(),counter:res.args._playerCounter.toNumber()}
    var result = helper.parsePlayEvent(playEvent, pendingSelections, confirmedSelections);
    pendingSelections = result[0]
    confirmedSelections = result[1]
    if(debug) {
    console.log("---------------------------------");
    console.log("In event Play:");
    console.log("pending selections");
    console.log(JSON.stringify(pendingSelections));
    console.log("Confirmed selections");
    console.log(JSON.stringify(confirmedSelections));
    console.log("---------------------------------");
  }
  } else {
    console.log(err)
  }
  if(!result[2])
    io.sockets.emit("newConfirmed", confirmedSelections[confirmedSelections.length-1])
})

var PlayerReadyEvent = instance.LogPlayersReady({}, {fromBlock:"latest", toBlock:"latest"})
PlayerReadyEvent.watch(function(err,res) {
  if(!err) {
    console.log("PLAYER READY EVENT")
    console.log(JSON.stringify(res))
    //Should start a 3 block timeout to unblock button
    //Could pull blocknumber and compare for a while
    setTimeout(function(){
      console.log("unblock button");
      io.sockets.emit("unblockButton")
    }, 10000)
  } else {
    console.log(err);
  }
})

var FinishEvent = instance.LogGameFinished({},{fromBlock:"latest", toBlock:"latest"})
FinishEvent.watch(function(err,res) {
  if(!err){
    console.log("------------------------------------");
    console.log("REVEAL WINNER EVENT");
    console.log(JSON.stringify(res));
    pendingSelections = []
    confirmedSelections = []
    console.log("------------------------------------");
  } else {
    console.log(err)
  }
})



io.on('connection',function(socket){
  socket.on("gameLoaded",function(){
    confirmed = helper.addPendingField(confirmedSelections,false)
    socket.emit("allPlayers", confirmed.concat(helper.addPendingField(pendingSelections, true)));
    });
    socket.on("selectNonce", function(data){
      if(helper.nonceValid(pendingSelections.concat(confirmedSelections), parseInt(data.nonce))){
        if(debug) {
        console.log("---------------------------------");
        console.log("new pending selection made");
        console.log(data.nonce);
        console.log("---------------------------------");
      }
        pendingSelections.push({address : data.address.toLowerCase(), x: parseInt(data.x), y: parseInt(data.y), nonce: parseInt(data.nonce)})
        socket.emit("newSelection", data.nonce);
      } else {
        if(debug) {
        console.log("---------------------------------");
        console.log("Nonce already selected or nonce invalid");
        console.log(data.nonce);
        console.log("---------------------------------");
      }
      }
      });

    socket.on("debugPlayers", function(){
      if(debug) {
      console.log("---------------------------------");
      console.log("DEBUG PLAYER");
      confirmed = helper.addPendingField(confirmedSelections, false)
      console.log(confirmed.concat(helper.addPendingField(pendingSelections)))
      console.log("---------------------------------");
    }
  });
    socket.on("revealWinner", function(){
       console.log("blocking button");
        socket.emit("blockButton")
        setTimeout(function(){
          console.log("unblock button");
          io.sockets.emit("unblockButton")
        }, 10000)
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
