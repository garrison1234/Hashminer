var getXandY = function(nonce) {
  var x,y;
  switch (nonce) {
    case 0:
      x = 120; y = 67;
    break;
    case 1:
      x = 120; y = 202;
    break;
    case 2:
      x = 120; y = 337;
    break;
    case 3:
      x = 120; y = 473;
    break;
    case 4:
      x = 360; y = 67;
    break;
    case 5:
      x = 360;y = 202;
    break;
    case 6:
      x = 360;y = 337;
    break;
    case 7:
      x = 360;y = 473;
    break;
    case 8:
      x = 600;y = 67;
    break;
    case 9:
      x = 600;y = 202;
    break;
    case 10:
      x = 600;y = 337;
    break;
    case 11:
      x = 600;y = 473;
    break;
    case 12:
      x = 840;y = 67;
    break;
    case 13:
      x = 840;y = 202;
    break;
    case 14:
      x = 840;y = 337;
    break;
    case 15:
      x = 840;y = 473;
    break;
  }
  return [x,y]
}

module.exports = {

  containsPending : function(pendingSelections, obj) {
    for(var i = 0; i < pendingSelections.length; i++) {
      if(pendingSelections[i] === obj )
        return [true, i]
    }
    return [false]
  },
  nonceValid : function (array, nonce) {
    for(var i = 0; i < array.length; i++) {
      if(array[i].nonce === nonce) return false;}
    if(nonce < 16 && nonce > -1) return true;
    else return false;
  },
  loadStartingState : function (playersInfo) {
    var confirmedSelections = []
    for(var i = 0; i < playersInfo[0].length;i++) {
      var coor = getXandY(Number(playersInfo[1][i])); //HA changed toNumber() to Number()
      var selection = { address: playersInfo[0][i], x:coor[0],y:coor[1],nonce:playersInfo[1][i]}; //HA removed toNumber()
      confirmedSelections.push(selection)
    }
    return confirmedSelections
  },
  addPendingField : function (pendingSelections, pendingStatus) {
    pendingSelections.forEach(function(obj) { obj.pending = pendingStatus;});
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
      return;
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
      if (typeof index !== 'undefined') {
        console.log("here");
        confirmedSelections.push({address: pendingSelections[index].address, x:pendingSelections[index].x,y:pendingSelections[index].y,nonce:pendingSelections[index].nonce})
        pendingSelections.splice(index,1)
      } else {
        coor = getXandY(playEvent.nonce)
        confirmedSelections.push({address : playEvent.address, x:coor[0], y:coor[1], nonce : playEvent.nonce})
      }}
    }

    var noChange = false
    if(confirmedSelections.length === 0) {
      if(pendingSelections.length === 0) {
        //In the case of a first new playGame
        if(playEvent.counter == 0 ) {
          coor = getXandY(playEvent.nonce)
          confirmedSelections.push({address : playEvent.address, x:coor[0], y:coor[1], nonce : playEvent.nonce})
        //old event or ambiguous if not maxNum
        } else {
          noChange = true
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
    return [pendingSelections, confirmedSelections, noChange]
  },

  currentTimeInMillis : function () {
    date = new Date()
    return date.getTime()
  }
}
