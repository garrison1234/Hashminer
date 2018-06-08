var express = require('express');
var app = express();
var server = require('http').Server(app);
var io = require('socket.io').listen(server);
var helper = require("./helper.js")
var Web3 = require('web3');
var contract = require("truffle-contract");
var fs = require("fs");
//var HDWalletProvider = require("truffle-hdwallet-provider");
var web3
web3 = new Web3(new Web3.providers.HttpProvider("https://rinkeby.infura.io/LkO37PKVOQPojiMpZpPO"));

app.use('/css',express.static(__dirname + '/css'));
app.use('/js',express.static(__dirname + '/js'));
app.use('/assets',express.static(__dirname + '/assets'));
app.use('/fonts',express.static(__dirname + '/fonts'));
app.use('/',express.static(__dirname + '/'));
app.use('/build',express.static(__dirname+ '/build'));
app.use('/contracts',express.static(__dirname+ '/contracts'));

app.get('/',function(req,res){
  //res.sendFile(__dirname+'/index0.html');
  res.sendFile(__dirname+'/index.html');
});

server.listen(process.env.PORT || 8081,function(){
  console.log('Listening on '+server.address().port);
});
var debug = true
var pendingTime = 180000
var pendingIntervalActive = false
var pendingSelections = []
var confirmedSelections = []
var gameInfo = []
var hashminerAbi = JSON.parse(fs.readFileSync("build/contracts/Hashminer.json")).abi //HA changed this for npm start script to run (package.json)
var instance = new web3.eth.Contract(hashminerAbi, '0x190d632dfa964bdf8108d05f87e8e59b97931e7f') //HA for web3 1.0
//var mnemonic = "";
//var provider =  new HDWalletProvider(mnemonic, "https://rinkeby.infura.io/LkO37PKVOQPojiMpZpPO")
//console.log(provider.wallets);
//var address = "0x190d632dfa964bdf8108d05f87e8e59b97931e7f" //HA rinkeby address
//var instance = hashminer.at(address.toLowerCase())
instance.methods.getGameInfo().call({}, function(error, result){
  console.log(result);
});
//confirmedSelections = helper.loadStartingState(hashminer.methods.getPlayersInfo()) //change this to promise logic (see web.js 1.0.x docs)
//gameInfo = hashminer.methods.getGameInfo()
//drawBlock = gameInfo[5]
//maxPlayers = gameInfo[2].toNumber()
//currentBlock = web3.eth.blockNumber

/*if(debug) {
  console.log("Starting state");
  confirmed = helper.addPendingField(confirmedSelections,false)
  console.log(confirmed.concat(helper.addPendingField(pendingSelections)));

}

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
var globalTimer;
var PlayerReadyEvent = instance.LogPlayersReady({}, {fromBlock:"latest", toBlock:"latest"})
PlayerReadyEvent.watch(function(err,res) {
  if(!err) {
    if(debug) {
    console.log("PLAYER READY EVENT")
    console.log(JSON.stringify(res))
    }
    //Should start a 3 block timeout to unblock button
    //Could pull blocknumber and compare for a while
  setTimeout(function(){
      console.log("unblock button");
      io.sockets.emit("unblockButton")
    }, 15000) //HA 3 blocks at 5s per block
  } else {
    console.log(err);
  }
})

var FinishEvent = instance.LogGameFinished({},{fromBlock:"latest", toBlock:"latest"})
FinishEvent.watch(function(err,res) {
  if(!err){
    if(debug){
    console.log("------------------------------------");
    console.log("REVEAL WINNER EVENT");
    console.log(JSON.stringify(res));
    console.log("------------------------------------");
    }
    pendingSelections = []
    confirmedSelections = []
    clearTimeout(globalTimer)
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
        pendingSelections.push({address : data.address.toLowerCase(), x: parseInt(data.x), y: parseInt(data.y), nonce: parseInt(data.nonce), time: helper.currentTimeInMillis()})
        socket.emit("newSelection", data.nonce);
        startPendingTimer()
      } else {
        if(debug) {
        console.log("---------------------------------");
        console.log("Nonce already selected or nonce invalid");
        console.log(data.nonce);
        console.log("---------------------------------");
      }}});

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
        globalTimer = setTimeout(function(){
          console.log("unblock button");
          io.sockets.emit("unblockButton")
        }, 10000)
      });
  });

  function startPendingTimer() {
    if(pendingIntervalActive)
      return
    else {
      pendingIntervalActive = true
      pendingInterval = setInterval(function(){

        var indexToRemove = []
        for(var i = 0; i < pendingSelections.length; i++) {
          if(helper.currentTimeInMillis() - pendingSelections[i].time > pendingTime){
              indexToRemove.push(i)
            }
        }
        for(i = 0; i < indexToRemove.length; i++) {
          pendingSelections.splice(indexToRemove[i],1)
        }
        if(debug && indexToRemove.length > 0) {
          console.log("----------------------------------")
          console.log("PENDING AFTER REMOVE");
          console.log(pendingSelections);
          console.log("----------------------------------")

        }
        if(pendingSelections.length == 0) {
          clearInterval(pendingInterval)
          pendingIntervalActive = false
        }
      },1000)
    }
  }
*/
  function initWeb3() {
    if (typeof web3 !== 'undefined') {
      var web3 = new Web3(web3.currentProvider);
    } else {
      var web3 = new Web3(new Web3.providers.HttpProvider("http://localhost:7545"));
    }
    return web3
  }
