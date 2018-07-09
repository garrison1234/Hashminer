var express = require('express');
var app = express();
var server = require('http').Server(app);
var io = require('socket.io').listen(server);
var helper = require("./helper.js")
const Web3 = require('web3');
var contract = require("truffle-contract");
var fs = require("fs");

// web3 provider
//var web3 = new Web3(new Web3.providers.HttpProvider("http://localhost:7545")); // Ganache
//var web3 = new Web3(new Web3.providers.HttpProvider("https://rinkeby.infura.io/LkO37PKVOQPojiMpZpPO")); // rinkeby HttpProvider
const web3 = new Web3(new Web3.providers.WebsocketProvider('wss://rinkeby.infura.io/ws')); // rinkeby WebsocketProvider (still in Beta)

// check if socket provider subscription is working
const subscription = web3.eth.subscribe('newBlockHeaders', (error, blockHeader) => {
  if (error) return console.error(error);
  console.log('Successfully subscribed!');
}).on('data', (blockHeader) => {
  console.log('data received ');
});

app.use('/css',express.static(__dirname + '/css'));
app.use('/js',express.static(__dirname + '/js'));
app.use('/assets',express.static(__dirname + '/assets'));
app.use('/fonts',express.static(__dirname + '/fonts'));
app.use('/',express.static(__dirname + '/'));
app.use('/build',express.static(__dirname+ '/build'));
app.use('/contracts',express.static(__dirname+ '/contracts'));

app.get('/',function(req,res){
  //res.sendFile(__dirname+'/index0.html');
  //res.sendFile(__dirname+'/game.html');
  res.sendFile(__dirname+'/index.html');
});

server.listen(process.env.PORT || 8081,function(){
  console.log('Listening on '+server.address().port);
});
var debug = true;
var pendingTimer = [];
var pendingSelections = [];
var confirmedSelections = [];
var gameInfo = [];
var hashminerAbi = JSON.parse(fs.readFileSync("build/contracts/Hashminer.json")).abi; //HA changed this for npm start script to run (package.json)
var address = "0x190d632dfa964bdf8108d05f87e8e59b97931e7f"; //HA rinkeby address
var instance = new web3.eth.Contract(hashminerAbi, address); //HA for web3 1.0

instance.methods.getPlayersInfo().call({}, function(error, result){
  confirmedSelections = helper.loadStartingState(result);
  if(debug) {
    console.log("Starting state");
    confirmed = helper.addPendingField(confirmedSelections,false)
    console.log(confirmed.concat(helper.addPendingField(pendingSelections)));
  }
});

instance.methods.getGameInfo().call({}, function(error, result){
  gameInfo = result;
  drawBlock = gameInfo[5];
  maxPlayers = gameInfo[2];
});

currentBlock =  web3.eth.getBlockNumber()
.then(function (blockNumber){
  return blockNumber;
});

io.on('connection',function(socket){
  socket.on("gameLoaded",function(){
    confirmed = helper.addPendingField(confirmedSelections,false)
    socket.emit("allPlayers", confirmed.concat(helper.addPendingField(pendingSelections, true)));
    });
    socket.on("selectNonce", function(data){

      console.log(JSON.stringify(data));

      if(helper.nonceValid(pendingSelections.concat(confirmedSelections), parseInt(data.nonce))){
        if(debug) {
        console.log("---------------------------------");
        console.log("new pending selection made");
        console.log(data.nonce);
        console.log("---------------------------------");
      }
        var newPendingSelection = {
          address : data.address.toLowerCase(),
          x: parseInt(data.x),
          y: parseInt(data.y),
          nonce: parseInt(data.nonce),
          time: helper.currentTimeInMillis()};
        pendingSelections.push(newPendingSelection);
        socket.emit("newSelection", data.nonce);
        startPendingTimer(newPendingSelection.nonce);
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
        }, 60000)
      });
  });

  function startPendingTimer(nonce) {
    // start timer for selected nonce
    console.log('timer started for nonce: ' + nonce);
    pendingTimer[nonce] = setTimeout(function(){

      //var indexToRemove = []
      /*for(var i = 0; i < pendingSelections.length; i++) {
        if(helper.currentTimeInMillis() - pendingSelections[i].time > pendingTime){
            indexToRemove.push(i)
          }
      }*/
      /*for(i = 0; i < indexToRemove.length; i++) {
        pendingSelections.splice(indexToRemove[i],1)
      }*/

      var newPendingSelections = [];
      pendingSelections.forEach(function(element){
        if(element.nonce != nonce){
          newPendingSelections.push(element);
        }
      });
      pendingSelections = newPendingSelections;

      io.sockets.emit("nonceCancelled", nonce);

      console.log('timer expired for nonce: ' + nonce);

    }, 60000);
  }

  function initWeb3() {
    if (typeof web3 !== 'undefined') {
      var web3 = new Web3(web3.currentProvider);
    } else {
      var web3 = new Web3(new Web3.providers.HttpProvider("http://localhost:7545"));
    }
    return web3
  }
