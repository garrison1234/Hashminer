module.exports = {

  nonceValid : function (array, nonce) {
    for(var i = 0; i < array.length; i++) {
      if(array[i].nonce === nonce) return false;
    }
    if(nonce < 16 && nonce > -1) return true;
    else return false;
  },
  getAllPlayers : function (Players) {
    var validPlayers = []
    for(var i = 0; i < Players.length; i++) {
      if(Players[i].x !== undefined ){
        validPlayers.push(Players[i]);
      }
    }
    return validPlayers;
  },
  updatePlayer: function (Players, data) {
    var exist = false;
    for(var i = 0; i < Players.length;i++){
      if(Players[i].address === data.address && Players[i].x === undefined){
        //Can a user send us a function here ? To clean here.....
        Players[i] = data;
        console.log(JSON.stringify(Players))
        exist = true
        return [Players, exist, i];
      }
    }
    return [Players, exist]

  }
}
