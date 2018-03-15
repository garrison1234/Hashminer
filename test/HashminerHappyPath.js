var Hashminer = artifacts.require("./Hashminer.sol");

// test suite
contract('Hashminer', function(accounts){
  var HashminerInstance;
//  var seller = accounts[1];


  it("Checking initial values", function() {
    return Hashminer.deployed().then(function(instance) {
      return instance.getGameInfo();
    }).then(function(data) {
      //console.log(data);
      assert.equal(data[1], false, "Game must be unlocked at the beginning");
      assert.equal(data[2].toNumber(), 16, "Max number of players must be 16");
      assert.equal(data[3].toNumber(), 0, "Player counter must be 0");
      assert.equal(data[4].toNumber(), web3.toWei(0.05, "ether") , "Game cost is 500");
      assert.equal(data[9].toNumber(), web3.toWei(0.7600, "ether"), "Prize must be 7600");
      assert.equal(data[10].toNumber(), web3.toWei(0.002, "ether"), "Caller incentive must be 20");

    })
  });

  it("Add Player 1", function() {
   return Hashminer.deployed().then(function(instance) {
      HashminerInstance = instance;
      return HashminerInstance.playGame(1,{from:web3.eth.accounts[5], value:web3.toWei(50,"finney")});
    }).then(function() {
      return HashminerInstance.getGameInfo();
    }).then(function(data) {
      assert.equal(data[0], '0x627306090abab3a6e1400e9345bc60c78a8bef57', "Incorrect address of owner");
      assert.equal(data[1], false, "Game must be unlocked after adding first player");
      assert.equal(data[2].toNumber(), 16, "Max number of players must be 16");
      assert.equal(data[3].toNumber(), 1, "Player counter must be 1 after adding first player");
      assert.equal(data[4].toNumber(), web3.toWei(0.05, "ether") , "Game cost is 500");
      assert.equal(data[5].toNumber(), 0, "BlockNumber must be 0");
      //assert.equal(data[6], 0, "BlockHash must be 0");
      assert.equal(data[7].toNumber(), 0, "winningNonce must be 0 because no winner yet");
    //  assert.equal(data[8].toNumber(), 0, "Winner must be 0 because no winner yet");
      assert.equal(data[9].toNumber(), web3.toWei(0.7600, "ether") , "Prize must be 7600 wei");
      assert.equal(data[10].toNumber(), web3.toWei(0.002, "ether"), "Caller incentive must be 20");
      assert.equal(data[11], '0x0000000000000000000000000000000000000000', "Caller must be 0");
    });
  });

  it("Add Player 2", function() {
   return Hashminer.deployed().then(function(instance) {
      HashminerInstance = instance;
      return HashminerInstance.playGame(2,{from:web3.eth.accounts[5], value:web3.toWei(50,"finney")});
    }).then(function() {
      return HashminerInstance.getGameInfo();
    }).then(function(data) {
      assert.equal(data[0], '0x627306090abab3a6e1400e9345bc60c78a8bef57', "Incorrect address of owner");
      assert.equal(data[1], false, "Game must be unlocked after adding first player");
      assert.equal(data[2].toNumber(), 16, "Max number of players must be 16");
      assert.equal(data[3].toNumber(), 2, "Player counter must be 2 after adding second player");
      assert.equal(data[4].toNumber(), web3.toWei(0.05, "ether") , "Game cost is 500");
      assert.equal(data[5].toNumber(), 0, "BlockNumber must be 0");
      //assert.equal(data[6], 0, "BlockHash must be 0");
      assert.equal(data[7].toNumber(), 0, "winningNonce must be 0 because no winner yet");
    //  assert.equal(data[8].toNumber(), 0, "Winner must be 0 because no winner yet");
      assert.equal(data[9].toNumber(), web3.toWei(0.7600, "ether") , "Prize must be 7600 wei");
      assert.equal(data[10].toNumber(), web3.toWei(0.002, "ether"), "Caller incentive must be 20");
      assert.equal(data[11], '0x0000000000000000000000000000000000000000', "Caller must be 0");
    });
  });

  it("Add Player 3", function() {
   return Hashminer.deployed().then(function(instance) {
      HashminerInstance = instance;
      return HashminerInstance.playGame(3,{from:web3.eth.accounts[5], value:web3.toWei(50,"finney")});
    }).then(function() {
      return HashminerInstance.getGameInfo();
    }).then(function(data) {
      assert.equal(data[0], '0x627306090abab3a6e1400e9345bc60c78a8bef57', "Incorrect address of owner");
      assert.equal(data[1], false, "Game must be unlocked after adding first player");
      assert.equal(data[2].toNumber(), 16, "Max number of players must be 16");
      assert.equal(data[3].toNumber(), 3, "Player counter must be 3 after adding third player");
      assert.equal(data[4].toNumber(), web3.toWei(0.05, "ether") , "Game cost is 500");
      assert.equal(data[5].toNumber(), 0, "BlockNumber must be 0");
      //assert.equal(data[6], 0, "BlockHash must be 0");
      assert.equal(data[7].toNumber(), 0, "winningNonce must be 0 because no winner yet");
    //  assert.equal(data[8].toNumber(), 0, "Winner must be 0 because no winner yet");
      assert.equal(data[9].toNumber(), web3.toWei(0.7600, "ether") , "Prize must be 7600 wei");
      assert.equal(data[10].toNumber(), web3.toWei(0.002, "ether"), "Caller incentive must be 20");
      assert.equal(data[11], '0x0000000000000000000000000000000000000000', "Caller must be 0");
    });
  });

  it("Add Player 4", function() {
   return Hashminer.deployed().then(function(instance) {
      HashminerInstance = instance;
      return HashminerInstance.playGame(4,{from:web3.eth.accounts[5], value:web3.toWei(50,"finney")});
    }).then(function() {
      return HashminerInstance.getGameInfo();
    }).then(function(data) {
      assert.equal(data[0], '0x627306090abab3a6e1400e9345bc60c78a8bef57', "Incorrect address of owner");
      assert.equal(data[1], false, "Game must be unlocked after adding first player");
      assert.equal(data[2].toNumber(), 16, "Max number of players must be 16");
      assert.equal(data[3].toNumber(), 4, "Player counter must be 4 after adding 4 players");
      assert.equal(data[4].toNumber(), web3.toWei(0.05, "ether") , "Game cost is 500");
      assert.equal(data[5].toNumber(), 0, "BlockNumber must be 0");
      //assert.equal(data[6], 0, "BlockHash must be 0");
      assert.equal(data[7].toNumber(), 0, "winningNonce must be 0 because no winner yet");
    //  assert.equal(data[8].toNumber(), 0, "Winner must be 0 because no winner yet");
      assert.equal(data[9].toNumber(), web3.toWei(0.7600, "ether") , "Prize must be 7600 wei");
      assert.equal(data[10].toNumber(), web3.toWei(0.002, "ether"), "Caller incentive must be 20");
      assert.equal(data[11], '0x0000000000000000000000000000000000000000', "Caller must be 0");
    });
  });

  it("Add Player 5", function() {
   return Hashminer.deployed().then(function(instance) {
      HashminerInstance = instance;
      return HashminerInstance.playGame(5,{from:web3.eth.accounts[5], value:web3.toWei(50,"finney")});
    }).then(function() {
      return HashminerInstance.getGameInfo();
    }).then(function(data) {
      assert.equal(data[0], '0x627306090abab3a6e1400e9345bc60c78a8bef57', "Incorrect address of owner");
      assert.equal(data[1], false, "Game must be unlocked after adding first player");
      assert.equal(data[2].toNumber(), 16, "Max number of players must be 16");
      assert.equal(data[3].toNumber(), 5, "Player counter must be 5 after adding five players");
      assert.equal(data[4].toNumber(), web3.toWei(0.05, "ether") , "Game cost is 500");
      assert.equal(data[5].toNumber(), 0, "BlockNumber must be 0");
      //assert.equal(data[6], 0, "BlockHash must be 0");
      assert.equal(data[7].toNumber(), 0, "winningNonce must be 0 because no winner yet");
    //  assert.equal(data[8].toNumber(), 0, "Winner must be 0 because no winner yet");
      assert.equal(data[9].toNumber(), web3.toWei(0.7600, "ether") , "Prize must be 7600 wei");
      assert.equal(data[10].toNumber(), web3.toWei(0.002, "ether"), "Caller incentive must be 20");
      assert.equal(data[11], '0x0000000000000000000000000000000000000000', "Caller must be 0");
    });
  });

  it("Add Player 6", function() {
   return Hashminer.deployed().then(function(instance) {
      HashminerInstance = instance;
      return HashminerInstance.playGame(6,{from:web3.eth.accounts[5], value:web3.toWei(50,"finney")});
    }).then(function() {
      return HashminerInstance.getGameInfo();
    }).then(function(data) {
      assert.equal(data[0], '0x627306090abab3a6e1400e9345bc60c78a8bef57', "Incorrect address of owner");
      assert.equal(data[1], false, "Game must be unlocked after adding first player");
      assert.equal(data[2].toNumber(), 16, "Max number of players must be 16");
      assert.equal(data[3].toNumber(), 6, "Player counter must be 6 after adding six players");
      assert.equal(data[4].toNumber(), web3.toWei(0.05, "ether") , "Game cost is 500");
      assert.equal(data[5].toNumber(), 0, "BlockNumber must be 0");
      //assert.equal(data[6], 0, "BlockHash must be 0");
      assert.equal(data[7].toNumber(), 0, "winningNonce must be 0 because no winner yet");
    //  assert.equal(data[8].toNumber(), 0, "Winner must be 0 because no winner yet");
      assert.equal(data[9].toNumber(), web3.toWei(0.7600, "ether") , "Prize must be 7600 wei");
      assert.equal(data[10].toNumber(), web3.toWei(0.002, "ether"), "Caller incentive must be 20");
      assert.equal(data[11], '0x0000000000000000000000000000000000000000', "Caller must be 0");
    });
  });

  it("Add Player 7", function() {
   return Hashminer.deployed().then(function(instance) {
      HashminerInstance = instance;
      return HashminerInstance.playGame(7,{from:web3.eth.accounts[5], value:web3.toWei(50,"finney")});
    }).then(function() {
      return HashminerInstance.getGameInfo();
    }).then(function(data) {
      assert.equal(data[0], '0x627306090abab3a6e1400e9345bc60c78a8bef57', "Incorrect address of owner");
      assert.equal(data[1], false, "Game must be unlocked after adding first player");
      assert.equal(data[2].toNumber(), 16, "Max number of players must be 16");
      assert.equal(data[3].toNumber(), 7, "Player counter must be 7 after adding 7 players");
      assert.equal(data[4].toNumber(), web3.toWei(0.05, "ether") , "Game cost is 500");
      assert.equal(data[5].toNumber(), 0, "BlockNumber must be 0");
      //assert.equal(data[6], 0, "BlockHash must be 0");
      assert.equal(data[7].toNumber(), 0, "winningNonce must be 0 because no winner yet");
    //  assert.equal(data[8].toNumber(), 0, "Winner must be 0 because no winner yet");
      assert.equal(data[9].toNumber(), web3.toWei(0.7600, "ether") , "Prize must be 7600 wei");
      assert.equal(data[10].toNumber(), web3.toWei(0.002, "ether"), "Caller incentive must be 20");
      assert.equal(data[11], '0x0000000000000000000000000000000000000000', "Caller must be 0");
    });
  });

  it("Add Player 8", function() {
   return Hashminer.deployed().then(function(instance) {
      HashminerInstance = instance;
      return HashminerInstance.playGame(8,{from:web3.eth.accounts[5], value:web3.toWei(50,"finney")});
    }).then(function() {
      return HashminerInstance.getGameInfo();
    }).then(function(data) {
      assert.equal(data[0], '0x627306090abab3a6e1400e9345bc60c78a8bef57', "Incorrect address of owner");
      assert.equal(data[1], false, "Game must be unlocked after adding first player");
      assert.equal(data[2].toNumber(), 16, "Max number of players must be 16");
      assert.equal(data[3].toNumber(), 8, "Player counter must be 8 after adding eight players");
      assert.equal(data[4].toNumber(), web3.toWei(0.05, "ether") , "Game cost is 500");
      assert.equal(data[5].toNumber(), 0, "BlockNumber must be 0");
      //assert.equal(data[6], 0, "BlockHash must be 0");
      assert.equal(data[7].toNumber(), 0, "winningNonce must be 0 because no winner yet");
    //  assert.equal(data[8].toNumber(), 0, "Winner must be 0 because no winner yet");
      assert.equal(data[9].toNumber(), web3.toWei(0.7600, "ether") , "Prize must be 7600 wei");
      assert.equal(data[10].toNumber(), web3.toWei(0.002, "ether"), "Caller incentive must be 20");
      assert.equal(data[11], '0x0000000000000000000000000000000000000000', "Caller must be 0");
    });
  });

  it("Add Player 9", function() {
   return Hashminer.deployed().then(function(instance) {
      HashminerInstance = instance;
      return HashminerInstance.playGame(9,{from:web3.eth.accounts[5], value:web3.toWei(50,"finney")});
    }).then(function() {
      return HashminerInstance.getGameInfo();
    }).then(function(data) {
      assert.equal(data[0], '0x627306090abab3a6e1400e9345bc60c78a8bef57', "Incorrect address of owner");
      assert.equal(data[1], false, "Game must be unlocked after adding first player");
      assert.equal(data[2].toNumber(), 16, "Max number of players must be 16");
      assert.equal(data[3].toNumber(), 9, "Player counter must be 9 after adding 9 players");
      assert.equal(data[4].toNumber(), web3.toWei(0.05, "ether") , "Game cost is 500");
      assert.equal(data[5].toNumber(), 0, "BlockNumber must be 0");
      //assert.equal(data[6], 0, "BlockHash must be 0");
      assert.equal(data[7].toNumber(), 0, "winningNonce must be 0 because no winner yet");
    //  assert.equal(data[8].toNumber(), 0, "Winner must be 0 because no winner yet");
      assert.equal(data[9].toNumber(), web3.toWei(0.7600, "ether") , "Prize must be 7600 wei");
      assert.equal(data[10].toNumber(), web3.toWei(0.002, "ether"), "Caller incentive must be 20");
      assert.equal(data[11], '0x0000000000000000000000000000000000000000', "Caller must be 0");
    });
  });

  it("Add Player 10", function() {
   return Hashminer.deployed().then(function(instance) {
      HashminerInstance = instance;
      return HashminerInstance.playGame(10,{from:web3.eth.accounts[5], value:web3.toWei(50,"finney")});
    }).then(function() {
      return HashminerInstance.getGameInfo();
    }).then(function(data) {
      assert.equal(data[0], '0x627306090abab3a6e1400e9345bc60c78a8bef57', "Incorrect address of owner");
      assert.equal(data[1], false, "Game must be unlocked after adding first player");
      assert.equal(data[2].toNumber(), 16, "Max number of players must be 16");
      assert.equal(data[3].toNumber(), 10, "Player counter must be 10 after adding ten players");
      assert.equal(data[4].toNumber(), web3.toWei(0.05, "ether") , "Game cost is 500");
      assert.equal(data[5].toNumber(), 0, "BlockNumber must be 0");
      //assert.equal(data[6], 0, "BlockHash must be 0");
      assert.equal(data[7].toNumber(), 0, "winningNonce must be 0 because no winner yet");
    //  assert.equal(data[8].toNumber(), 0, "Winner must be 0 because no winner yet");
      assert.equal(data[9].toNumber(), web3.toWei(0.7600, "ether") , "Prize must be 7600 wei");
      assert.equal(data[10].toNumber(), web3.toWei(0.002, "ether"), "Caller incentive must be 20");
      assert.equal(data[11], '0x0000000000000000000000000000000000000000', "Caller must be 0");
    });
  });

  it("Add Player 11", function() {
   return Hashminer.deployed().then(function(instance) {
      HashminerInstance = instance;
      return HashminerInstance.playGame(11,{from:web3.eth.accounts[5], value:web3.toWei(50,"finney")});
    }).then(function() {
      return HashminerInstance.getGameInfo();
    }).then(function(data) {
      assert.equal(data[0], '0x627306090abab3a6e1400e9345bc60c78a8bef57', "Incorrect address of owner");
      assert.equal(data[1], false, "Game must be unlocked after adding first player");
      assert.equal(data[2].toNumber(), 16, "Max number of players must be 16");
      assert.equal(data[3].toNumber(), 11, "Player counter must be 11 after adding eleven players");
      assert.equal(data[4].toNumber(), web3.toWei(0.05, "ether") , "Game cost is 500");
      assert.equal(data[5].toNumber(), 0, "BlockNumber must be 0");
      //assert.equal(data[6], 0, "BlockHash must be 0");
      assert.equal(data[7].toNumber(), 0, "winningNonce must be 0 because no winner yet");
    //  assert.equal(data[8].toNumber(), 0, "Winner must be 0 because no winner yet");
      assert.equal(data[9].toNumber(), web3.toWei(0.7600, "ether") , "Prize must be 7600 wei");
      assert.equal(data[10].toNumber(), web3.toWei(0.002, "ether"), "Caller incentive must be 20");
      assert.equal(data[11], '0x0000000000000000000000000000000000000000', "Caller must be 0");
    });
  });

  it("Add Player 12", function() {
   return Hashminer.deployed().then(function(instance) {
      HashminerInstance = instance;
      return HashminerInstance.playGame(12,{from:web3.eth.accounts[5], value:web3.toWei(50,"finney")});
    }).then(function() {
      return HashminerInstance.getGameInfo();
    }).then(function(data) {
      assert.equal(data[0], '0x627306090abab3a6e1400e9345bc60c78a8bef57', "Incorrect address of owner");
      assert.equal(data[1], false, "Game must be unlocked after adding first player");
      assert.equal(data[2].toNumber(), 16, "Max number of players must be 16");
      assert.equal(data[3].toNumber(), 12, "Player counter must be 12 after adding twelve players");
      assert.equal(data[4].toNumber(), web3.toWei(0.05, "ether") , "Game cost is 500");
      assert.equal(data[5].toNumber(), 0, "BlockNumber must be 0");
      //assert.equal(data[6], 0, "BlockHash must be 0");
      assert.equal(data[7].toNumber(), 0, "winningNonce must be 0 because no winner yet");
    //  assert.equal(data[8].toNumber(), 0, "Winner must be 0 because no winner yet");
      assert.equal(data[9].toNumber(), web3.toWei(0.7600, "ether") , "Prize must be 7600 wei");
      assert.equal(data[10].toNumber(), web3.toWei(0.002, "ether"), "Caller incentive must be 20");
      assert.equal(data[11], '0x0000000000000000000000000000000000000000', "Caller must be 0");
    });
  });

  it("Add Player 13", function() {
   return Hashminer.deployed().then(function(instance) {
      HashminerInstance = instance;
      return HashminerInstance.playGame(13,{from:web3.eth.accounts[5], value:web3.toWei(50,"finney")});
    }).then(function() {
      return HashminerInstance.getGameInfo();
    }).then(function(data) {
      assert.equal(data[0], '0x627306090abab3a6e1400e9345bc60c78a8bef57', "Incorrect address of owner");
      assert.equal(data[1], false, "Game must be unlocked after adding first player");
      assert.equal(data[2].toNumber(), 16, "Max number of players must be 16");
      assert.equal(data[3].toNumber(), 13, "Player counter must be 13 after adding thirteen players");
      assert.equal(data[4].toNumber(), web3.toWei(0.05, "ether") , "Game cost is 500");
      assert.equal(data[5].toNumber(), 0, "BlockNumber must be 0");
      //assert.equal(data[6], 0, "BlockHash must be 0");
      assert.equal(data[7].toNumber(), 0, "winningNonce must be 0 because no winner yet");
    //  assert.equal(data[8].toNumber(), 0, "Winner must be 0 because no winner yet");
      assert.equal(data[9].toNumber(), web3.toWei(0.7600, "ether") , "Prize must be 7600 wei");
      assert.equal(data[10].toNumber(), web3.toWei(0.002, "ether"), "Caller incentive must be 20");
      assert.equal(data[11], '0x0000000000000000000000000000000000000000', "Caller must be 0");
    });
  });

  it("Add Player 14", function() {
   return Hashminer.deployed().then(function(instance) {
      HashminerInstance = instance;
      return HashminerInstance.playGame(14,{from:web3.eth.accounts[5], value:web3.toWei(50,"finney")});
    }).then(function() {
      return HashminerInstance.getGameInfo();
    }).then(function(data) {
      assert.equal(data[0], '0x627306090abab3a6e1400e9345bc60c78a8bef57', "Incorrect address of owner");
      assert.equal(data[1], false, "Game must be unlocked after adding first player");
      assert.equal(data[2].toNumber(), 16, "Max number of players must be 16");
      assert.equal(data[3].toNumber(), 14, "Player counter must be 14 after adding fourteen players");
      assert.equal(data[4].toNumber(), web3.toWei(0.05, "ether") , "Game cost is 500");
      assert.equal(data[5].toNumber(), 0, "BlockNumber must be 0");
      //assert.equal(data[6], 0, "BlockHash must be 0");
      assert.equal(data[7].toNumber(), 0, "winningNonce must be 0 because no winner yet");
    //  assert.equal(data[8].toNumber(), 0, "Winner must be 0 because no winner yet");
      assert.equal(data[9].toNumber(), web3.toWei(0.7600, "ether") , "Prize must be 7600 wei");
      assert.equal(data[10].toNumber(), web3.toWei(0.002, "ether"), "Caller incentive must be 20");
      assert.equal(data[11], '0x0000000000000000000000000000000000000000', "Caller must be 0");
    });
  });

  it("Add Player 15", function() {
   return Hashminer.deployed().then(function(instance) {
      HashminerInstance = instance;
      return HashminerInstance.playGame(15,{from:web3.eth.accounts[5], value:web3.toWei(50,"finney")});
    }).then(function() {
      return HashminerInstance.getGameInfo();
    }).then(function(data) {
      assert.equal(data[0], '0x627306090abab3a6e1400e9345bc60c78a8bef57', "Incorrect address of owner");
      assert.equal(data[1], false, "Game must be unlocked after adding first player");
      assert.equal(data[2].toNumber(), 16, "Max number of players must be 16");
      assert.equal(data[3].toNumber(), 15, "Player counter must be 16 after adding fifteen players");
      assert.equal(data[4].toNumber(), web3.toWei(0.05, "ether") , "Game cost is 500");
      assert.equal(data[5].toNumber(), 0, "BlockNumber must be 0");
      //assert.equal(data[6], 0, "BlockHash must be 0");
      assert.equal(data[7].toNumber(), 0, "winningNonce must be 0 because no winner yet");
    //  assert.equal(data[8].toNumber(), 0, "Winner must be 0 because no winner yet");
      assert.equal(data[9].toNumber(), web3.toWei(0.7600, "ether") , "Prize must be 7600 wei");
      assert.equal(data[10].toNumber(), web3.toWei(0.002, "ether"), "Caller incentive must be 20");
      assert.equal(data[11], '0x0000000000000000000000000000000000000000', "Caller must be 0");
    });
  });

  it("Add Player 16", function() {
   return Hashminer.deployed().then(function(instance) {
      HashminerInstance = instance;
      return HashminerInstance.playGame(16,{from:web3.eth.accounts[5], value:web3.toWei(50,"finney")});
    }).then(function() {
      return HashminerInstance.getGameInfo();
    }).then(function(data) {
      assert.equal(data[0], '0x627306090abab3a6e1400e9345bc60c78a8bef57', "Incorrect address of owner");
      assert.equal(data[1], false, "Game must be unlocked after adding first player");
      assert.equal(data[2].toNumber(), 16, "Max number of players must be 16");
      assert.equal(data[3].toNumber(), 16, "Player counter must be 16 after adding sixteen players");
      assert.equal(data[4].toNumber(), web3.toWei(0.05, "ether") , "Game cost is 500");
      //assert.equal(data[5].toNumber(), 0, "BlockNumber must be 0");
      //assert.equal(data[6], 0, "BlockHash must be 0");
      assert.equal(data[7].toNumber(), 0, "winningNonce must be 0 because no winner yet");
    //  assert.equal(data[8].toNumber(), 0, "Winner must be 0 because no winner yet");
      assert.equal(data[9].toNumber(), web3.toWei(0.7600, "ether") , "Prize must be 7600 wei");
      assert.equal(data[10].toNumber(), web3.toWei(0.002, "ether"), "Caller incentive must be 20");
      assert.equal(data[11], '0x0000000000000000000000000000000000000000', "Caller must be 0");
    });
  });


});
