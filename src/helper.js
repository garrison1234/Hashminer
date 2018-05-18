module.exports = {
  nonceValid : function (array, nonce) {
    for(var i = 0; i < array.length; i++) {
      if(array[i].nonce === nonce) return false;}
    if(nonce < 16 && nonce > -1) return true;
    else return false;
  }
}
