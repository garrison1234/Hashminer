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
app.use('/',express.static(__dirname + '/'));
app.use('/contracts',express.static(__dirname+ '/contracts'));

app.get('/',function(req,res){
  res.sendFile(__dirname+'/game.html');
});

server.listen(process.env.PORT || 8081,function(){
  console.log('Listening on '+server.address().port);
});

var pendingSelections = []
var confirmedSelections = [];
var pendingTimer;
var compteur = 0
var latestPlayEvents = []
var latestFinishEvents = []
var hashminerAbi = JSON.parse(fs.readFileSync("../build/contracts/Hashminer.json")).abi
var hashminer = web3.eth.contract(hashminerAbi)
var instance = hashminer.at("0xf12b5dd4ead5f743c6baa640b0216200e89b60da")

var PlayEvent = instance.LogPlayerAdded({},{fromBlock:"latest",toBlock:"latest"})
PlayEvent.watch(function(err,res) {
  if(!err){
    var playEvent = {address:res.args._wallet.toLowerCase(),nonce:res.args._nonce.toNumber(),counter:res.args._playerCounter.toNumber()}
    var result = helper.parsePlayEvent(playEvent, pendingSelections, confirmedSelections);
    pendingSelections = result[0]
    confirmedSelections = result[1]
    //HA console.log(JSON.stringify(pendingSelections));
    //HA console.log(JSON.stringify(confirmedSelections));
  } else {
    console.log(err)
  }
})

var FinishEvent = instance.LogGameFinished({},{fromBlock:"latest", toBlock:"latest"})
FinishEvent.watch(function(err,res) {
  if(!err){
    //Listen to winner, flush everything, it is confirmed.
  } else {
    console.log(err)
  }
})

confirmedSelections = helper.loadStartingState(instance.getPlayersInfo())

io.on('connection',function(socket){
  socket.on("gameLoaded",function(){

    socket.emit("allPlayers", confirmedSelections.concat(helper.addPendingField(pendingSelections)));
    socket.on("selectNonce", function(data){
      if(helper.nonceValid(pendingSelections.concat(confirmedSelections), data.nonce)){
        console.log(JSON.stringify(data))
        pendingSelections.push({address : data.address.toLowerCase(), x: parseInt(data.x), y: parseInt(data.y), nonce: parseInt(data.nonce)})
        socket.broadcast.emit("newSelection",pendingSelections.concat(confirmedSelections));
        }
      });
    });
    socket.on("debugPlayers", function(){
      console.log(confirmedSelections.concat(helper.addPendingField(pendingSelections)))
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
