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
//const web3 = new Web3(new Web3.providers.WebsocketProvider('wss://rinkeby.infura.io/ws')); // rinkeby WebsocketProvider (still in Beta)

// check if socket provider subscription is working
/*const subscription = web3.eth.subscribe('newBlockHeaders', (error, blockHeader) => {
  if (error) return console.error(error);
  console.log('Successfully subscribed!');
}).on('data', (blockHeader) => {
  console.log('data received ');
});*/

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
/*var pendingTimer = [];
var pendingSelections = [];
var confirmedSelections = [];*/
//var gameInfo = [];
/*var hashminerAbi = JSON.parse(fs.readFileSync("build/contracts/Hashminer.json")).abi; //HA changed this for npm start script to run (package.json)
var address = "0x190d632dfa964bdf8108d05f87e8e59b97931e7f"; //HA rinkeby address
var instance = new web3.eth.Contract(hashminerAbi, address); //HA for web3 1.0*/

/*instance.methods.getPlayersInfo().call({}, function(error, result){
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
});*/

io.on('connection',function(socket){
  /*socket.on("gameLoaded",function(){
    confirmed = helper.addPendingField(confirmedSelections,false)
    socket.emit("allPlayers", confirmed.concat(helper.addPendingField(pendingSelections, true)));
  });*/
    socket.on("selectNonce", function(data){
      // check that there is an address, coordinates are valid, and nonce is valid
      console.log('selection is valid>: ' + selectionValid(data));
      if(selectionValid(data)) {
        console.log('selection is valid');
        var newPendingSelection = {
          address : data.address.toLowerCase(),
          x: parseInt(data.x),
          y: parseInt(data.y),
          nonce: parseInt(data.nonce)};
        //pendingSelections.push(newPendingSelection);
        socket.broadcast.emit("newSelection", newPendingSelection);
        console.log('server broadcasts new selection: ' + JSON.stringify(newPendingSelection));
      }
    });
    socket.on("revealWinner", function(){
       console.log("blocking button");
        socket.broadcast.emit("blockButton");
      });
  });

  function selectionValid(selection) {
    // check that selection contains an address
    var address = selection.address;
    var x = parseInt(selection.x);
    var y = parseInt(selection.y);
    var nonce = parseInt(selection.nonce);
    if((nonce > -1) && (nonce < 16)) {
      var xmin = Math.trunc(nonce/4) * 240;
      var xmax = xmin + 240;
      if(x <= xmax && x >= xmin && x > 80 && x < 880) {
        var ymin = (nonce % 4) * 135;
        var ymax = ymin + 135;
        if(y <= ymax && y >= ymin && y > 80 && y < 560) {
          return true;
        } else {
          return false;
        }
      } else {
        return false;
      }
    } else {
      return false;
    }
  }

  // Timer for miner confirmation, commented since WebsocketProvider isn't reliable
  /*function startPendingTimer(nonce) {
    // start timer for selected nonce
    console.log('timer started for nonce: ' + nonce);
    pendingTimer[nonce] = setTimeout(function(){

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
  }*/

  function initWeb3() {
    if (typeof web3 !== 'undefined') {
      var web3 = new Web3(web3.currentProvider);
    } else {
      var web3 = new Web3(new Web3.providers.HttpProvider("http://localhost:7545"));
    }
    return web3
  }
