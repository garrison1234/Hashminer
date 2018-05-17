// contract to be tested
var Hashminer = artifacts.require("./Hashminer.sol");

// test suite
contract("Hashminer", function(accounts){
  var HashminerInstance;

  // Should send an exception if revealwinner() is called before any player has sent their bet
  it("Should send an exception if revealwinner() is called before any player has sent their bet ", function() {
    return Hashminer.deployed().then(function(instance) {
      HashminerInstance = instance;
      return HashminerInstance.revealWinner({from:'0x627306090abab3a6e1400e9345bc60c78a8bef57'});
    }).then(assert.fail)
    .catch(function(error){
      assert(true);
    }).then(function() {
      return HashminerInstance.getGameInfo();
    }).then(function(data) {
      assert.equal(data[1], false, "Game must be unlocked");
      assert.equal(data[2].toNumber(), 16, "Max number of players must be 16");
      assert.equal(data[4].toNumber(), web3.toWei(0.05, "ether") , "Game cost is 500");
    });
  });

});
