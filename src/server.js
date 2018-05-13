var express = require('express');
var app = express();
var server = require('http').Server(app);
var io = require('socket.io').listen(server);
var helper = require("./helper.js")

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

var Players = [];

io.on('connection',function(socket){

  socket.on("gameLoaded",function(data){
    var player = { address:data.address};
    Players.push(player);
    console.log(JSON.stringify(Players))
    socket.emit("allPlayers", helper.getAllPlayers(Players));

    socket.on("selectNonce", function(data){
      if(helper.nonceValid(Players, data.nonce)){
      //find the corresponding player in the array and update values
      Update = helper.updatePlayer(Players, data);
      //return Update  =  [Player, boolean exist, index]
      if(Update[1]) {
        Players = Update[0];
        socket.broadcast.emit("newSelection", Players[Update[2]]);
      }
      else
        console.log("error not in array Players when selecting");
      //--Should listen to ethereum, create a web 3 module initializing instance of contract




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
