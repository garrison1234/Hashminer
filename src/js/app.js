App = {
     web3Provider: null,
     contracts: {},
     account: 0x0,

     init: function() {
          return App.initWeb3();
     },

     // initialize web3 provider
     initWeb3: function() {
       // initialize web3
       if(typeof web3 !== 'undefined') {
         //reuse the provider of the Web3 object injected by Metamask
         App.web3Provider = web3.currentProvider;
       } else {
         //create a new provider and plug it directly into our local node
         App.web3Provider = new Web3.providers.HttpProvider('http://localhost:7545');
       }
       web3 = new Web3(App.web3Provider);

       App.displayAccountInfo();

       return App.initContract();
     },

     // display the user's ETH account and balance
     displayAccountInfo: function() {
       web3.eth.getCoinbase(function(err, account) {
         if(err === null) {
           App.account = account;
           $('#account').text("Account: "+ account);
           web3.eth.getBalance(account, function(err, balance) {
             if(err === null) {
               $('#accountBalance').text("Balance: " + web3.fromWei(balance, "ether") + " ETH");
             }
           })
         }
       });
     },

     // retrieve the Hashminer contract
     initContract: function() {
       $.getJSON('Hashminer.json', function(hashminerArtifact) {
         // get the contract artifact file and use it to instantiate a truffle contract abstraction
         App.contracts.Hashminer = TruffleContract(hashminerArtifact);
         // set the provider for our contracts
         App.contracts.Hashminer.setProvider(App.web3Provider);
         // displays all information
         App.displayGameInfo();
         App.displayPlayersInfo();
       });
     },

     playGame: function(_nonce, _xdestination, _ydestination) {
       App.contracts.Hashminer.deployed().then(function(instance) {
         return instance.playGame(_nonce, {
           from: App.account,
           value: web3.toWei(50, "finney"),
           gas: 500000
         });
       }).then(function(result) {
         //transaction was mined
         console.log('transaction successful');
       }).catch(function(err) {
         //transaction failed
         console.log('transaction failed');
       });
     },

     revealWinner: function() {
       App.contracts.Hashminer.deployed().then(function(instance) {
         return instance.revealWinner({
           from: App.account,
           gas: 500000
         });
       }).catch(function(err) {
         // revealWinner() transaction failed
       });
     },

     displayGameInfo: function() {
       App.contracts.Hashminer.deployed().then(function(instance) {
         return instance.getGameInfo();
       }).then(function(gameInformation) {
         // retrieve the game information from the contract.
         $('#owner').text(gameInformation[0]);
         $('#gameLocked').text(gameInformation[1]);
         $('#maxNumberOfPlayers').text(gameInformation[2]);
         $('#playerCounter').text(gameInformation[3]);
         $('#gameCost').text(web3.fromWei(gameInformation[4], "ether") + " ETH");
         $('#blockNumber').text(gameInformation[5]);
         $('#blockHash').text(gameInformation[6]);
         $('#winningNonce').text(gameInformation[7]);
         $('#winner').text(gameInformation[8]);
         $('#prize').text(web3.fromWei(gameInformation[9], "ether") + " ETH");
         $('#callerIncentive').text(web3.fromWei(gameInformation[10], "ether") + " ETH");
         $('#caller').text(gameInformation[11]);
       }).catch(function(err) {
         // getGameInfo() failed
       });
     },

     displayPlayersInfo: function() {
       App.contracts.Hashminer.deployed().then(function(instance) {
         return instance.getPlayersInfo();
       }).then(function(playersInformation) {
         $('#players-table > tbody').empty();
         App.takenNonces = [];
         for(i = 0; i < playersInformation[0].length; i++) {
           $('#players-table > tbody:last-child').append('<tr><td><p>' + playersInformation[0][i].slice(0,8) + '...' +
            '</p></td><td><p>' + playersInformation[1][i] + '</p></td></tr>');
         }
         playersInformation[1].forEach(function(item){App.takenNonces.push(item.toNumber());})

       }).catch(function(err) {
         // getGameInfo() failed
       });

     }

     /*listenToEvents: function() {
       App.contracts.Hashminer.deployed().then(function(instance) {

         // listen to LogPlayerAdded event
        instance.LogPlayerAdded({}, {}).watch(function(error, event) {
          if (!error) {
            // update game, players and account information
            App.displayGameInfo();
            App.displayPlayersInfo();
            App.displayAccountInfo();
          } else {
            console.error(error);
          }
        });

        // listen to LogPlayersReady event
       instance.LogPlayersReady({}, {}).watch(function(error, event) {
         if (!error) {
           // update game information
           App.displayGameInfo();
         } else {
           console.error(error);
         }
       });

       // listen to LogGameFinished event
      instance.LogGameFinished({}, {}).watch(function(error, event) {
        if (!error) {
          // update account, game and players information
          App.displayAccountInfo();
          App.displayGameInfo();
          App.displayPlayersInfo();
        } else {
          console.error(error);
        }
      });

      // listen to LogGameOptionsSet event
     instance.LogGameOptionsSet({}, {}).watch(function(error, event) {
       if (!error) {
         // update game information
         App.displayGameInfo();
       } else {
         console.error(error);
       }
     });

     // listen to LogGameLock event
    instance.LogGameLock({}, {}).watch(function(error, event) {
      if (!error) {
        // update game information
        App.displayGameInfo();
      } else {
        console.error(error);
      }
    });

      });
    }*/
};

$(function() {
     $(window).load(function() {
          App.init();
     });
});
