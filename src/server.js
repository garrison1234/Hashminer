var express = require('express');
var app = express();
var server = require('http').Server(app);
var io = require('socket.io').listen(server);
var fs = require("fs");

app.use('/css',express.static(__dirname + '/css'));
app.use('/js',express.static(__dirname + '/js'));
app.use('/assets',express.static(__dirname + '/assets'));
app.use('/fonts',express.static(__dirname + '/fonts'));
app.use('/',express.static(__dirname + '/'));
app.use('/build',express.static(__dirname+ '/build'));
app.use('/contracts',express.static(__dirname+ '/contracts'));

app.get('/',function(req,res){
  res.sendFile(__dirname+'/index.html');
});

server.listen(process.env.PORT || 8081,function(){
  console.log('Listening on '+server.address().port);
});

io.on('connection',function(socket){
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

  function initWeb3() {
    if (typeof web3 !== 'undefined') {
      var web3 = new Web3(web3.currentProvider);
    } else {
      var web3 = new Web3(new Web3.providers.HttpProvider("http://localhost:7545"));
    }
    return web3
  }
