module.exports = {
  nonceValid : function (array, nonce) {
    for(var i = 0; i < array.length; i++) {
      if(array[i].nonce === nonce) return false;}
    if(nonce < 16 && nonce > -1) return true;
    else return false;
  },
  loadStartingState : function (playersInfo) {
    var confirmedSelections = []
    for(var i = 0; i < playersInfo[0].length;i++) {
      var selection = { address: playersInfo[0][i], x:0,y:0,nonce:playersInfo[1][i].toNumber()}
      confirmedSelections.push(selection)
    }
    return confirmedSelections
  },
  addPendingField : function (pendingSelections) {
    pendingSelections.forEach(function(obj) { obj.pending = true;});
    return pendingSelections
  },
  //add game parameters
  parsePlayEvent : function (playEvent, pendingSelections, confirmedSelections) {

    var findIndexPending = function() {
      for(var i = 0 ; i < pendingSelections.length; i++){
        if(pendingSelections[i].address == playEvent.address) {
            return i;
        }
      }
      return false;
    }
    var noRepetition = function () {
      for(var i = 0; i < confirmedSelections.length; i++) {
        if(confirmedSelections[i].address == playEvent.address && confirmedSelections[i].nonce === playEvent.nonce ){
          return false
        }
      }
      return true
    }
    var removePendingErrors = function () {
      for(var i =0; i<pendingSelections.length; i++) {
        if(pendingSelections[i].nonce == playEvent.nonce) {
          pendingSelections.splice(i,1)
        }
      }
    }

    var modifyArrays = function () {
      if(noRepetition()) {
      var index = findIndexPending()
      if (typeof index != 'undefined' && index != false) {
        confirmedSelections.push({address: pendingSelections[index].address, x:pendingSelections[index].x,y:pendingSelections[index].y,nonce:pendingSelections[index].nonce})
        pendingSelections.splice(index,1)
      } else {
        //sinon ==> confirmedSelection with rdm x and y
        confirmedSelections.push({address : playEvent.address, x:0, y:0, nonce : playEvent.nonce})
      }}
    }

    if(confirmedSelections.length === 0) {
      if(pendingSelections.length === 0) {
        //In the case of a first new playGame
        if(playEvent.counter == 0 ) {
          confirmedSelections.push({address : playEvent.address, x:0, y:0, nonce : playEvent.nonce})
        //old event or ambiguous if not maxNum
        } else {
          console.log("ERROR playEvent counter is not 1 :: 2 to maxNumberOfPlayers");
          console.log(playEvent.counter);
        }
      //01
      } else {

        modifyArrays()
      }
    } else {
        modifyArrays()

    }
    removePendingErrors()
    return [pendingSelections, confirmedSelections]
  }
}
