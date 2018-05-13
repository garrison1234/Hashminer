var express = require('express');
var app = express();
var server = require('http').Server(app);
var io = require('socket.io').listen(server);

app.use('/css',express.static(__dirname + '/css'));
app.use('/js',express.static(__dirname + '/js'));
app.use('/assets',express.static(__dirname + '/assets'));
app.use('/fonts',express.static(__dirname + '/fonts'));

app.get('/',function(req,res){
  res.sendFile(__dirname+'/index.html');
});

server.listen(process.env.PORT || 8081,function(){
  console.log('Listening on '+server.address().port);
});

var Players = [];


io.on('connection',function(socket){

  socket.on("gameLoaded",function(data){
    var player = {address:data.address, x:null, y:null, nonce:null};
    Players.push(player);
    socket.emit("allPlayers", getAllPlayers())

    socket.on("selectNonce", function(data){
      var index = -1;

      if(nonceValid(Players, data.nonce)){
      //find the corresponding player in the array and update values
      let update = Players.find((o, i) => {
        if (o.address === data.address) {
          Players[i] = { x:data.x, y:data.y, nonce:data.nonce };
          index = i;
          return true;
        }
      });
      if(index !== -1)
        socket.broadcast.emit("newSelection", Players[index]);
      else
        console.log("error not in array Players when selecting");
      //--Should listen to ethereum, create a web 3 module initializing instance of contract
      //--Should check if selection is valid
      }
    });
  });

  socket.on("revealWinner", function(){
    //add internal state stopping submission of button because client side is never safe
    if(true) {
      socket.broadcast.emit("blockButton")
      //watch ethereum to get the winner
    }
  });

});

function nonceValid(array, nonce) {
  for(var i = 0; i < array.length, i++) {
    if(array[i].nonce === nonce) return false;
  }
  if(nonce < 16 && nonce > -1) return true;
  else return false;
}


function getAllPlayers() {
  var validPlayers = []
  for(var i = 0; i < Players.length; i++) {
    if(Players.x === null || Players.y === null || Players.nonce === null)
    continue;
    validPlayers.push(Players[i]);
  }
  return validPlayers;
}
