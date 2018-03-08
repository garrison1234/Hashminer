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
           $('#account').text(account);
           web3.eth.getBalance(account, function(err, balance) {
             if(err === null) {
               $('#accountBalance').text(web3.fromWei(balance, "ether") + " ETH");
             }
           })
         }
       });
     },

     initContract: function() {
       $.getJSON('Hashminer.json', function(hashminerArtifact) {
         // get the contract artifact file and use it to instantiate a truffle contract abstraction
         App.contracts.Hashminer = TruffleContract(hashminerArtifact);
         // set the provider for our contracts
         App.contracts.Hashminer.setProvider(App.web3Provider);
         // listen to events
         App.listenToEvents();

         // displays all information and sets status for the play/reveal buttons
         App.displayGameInfo();
         App.displayPlayersInfo();
         App.setPLayButtonStatus();
         App.setRevealButtonStatus();
       });
     },

     playGame: function() {
       // retrieve the nonce
       var _nonce = parseInt($('#nonce').val());

       // check that the nonce is a valid number
       if((_nonce < 1) || (nonce > 16)) {
         // player did not enter nonce
         return false;
       }

       App.contracts.Hashminer.deployed().then(function(instance) {
         return instance.playGame(_nonce, {
           from: App.account,
           value: web3.toWei(50,"finney"),
           gas: 500000
         });
       }).then(function(result) {
         // Here place the logic for placing the player on the map, since the bet has been placed (the block with the transaction was mined)
       }).catch(function(err) {
         console.error(err);
       });
     },

     displayGameInfo: function() {
       App.contracts.Hashminer.deployed().then(function(instance) {
         return instance.getGameInfo();
       }).then(function(
             gameInformation) {
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
         console.error(err.message);
       });
     },

     displayPlayersInfo: function() {
       App.contracts.Hashminer.deployed().then(function(instance) {
         return instance.getPlayersInfo();
       }).then(function(playersInformation) {
         // save playerAddresses and playerNonces arrays into a single one
         var currentPlayers = [];
         for(i = 0; i < playersInformation[0].length; i++) {
           currentPlayers.address = playersinformation[0][i];
           currentPlayers.nonce = playersinformation[1][i];
         }

         //$('#players-info-table').bootstrapTable("load", currentPlayers);
       }).catch(function(err) {
         console.error(err.message);
       });
     },

     setPLayButtonStatus: function() {

     },

     setRevealButtonStatus: function() {

     },

     listenToEvents: function() {
       App.contracts.Hashminer.deployed().then(function(instance) {

         // listen to LogPlayerAdded event
        instance.LogPlayerAdded({}, {}).watch(function(error, event) {
          if (!error) {
            // reload game information, players information and update account info if new player is the user
            App.displayGameInfo();
            App.displayPlayersInfo();
            if(event.args._wallet == App.account) {
              App.displayAccountInfo();
            }
          } else {
            console.error(error);
          }
        });

        // listen to LogPlayersReady event
       instance.LogPlayersReady({}, {}).watch(function(error, event) {
         if (!error) {
           // disable play button
           App.setPLayButtonStatus(disable);
           // set timer to enable reveal button
           setTimeout(App.setRevealButtonStatus(enable), 60000);
         } else {
           console.error(error);
         }
       });

       // listen to LogGameFinished event
      instance.LogGameFinished({}, {}).watch(function(error, event) {
        if (!error) {
          // enable play button
          App.setPLayButtonStatus(enable);
          // disable reveal button. THIS WILL BE MODIFIED TO BE DISABLED ONCE ONE PLAYER REVEALS, TO ENSURE IT'S NOT CALLED TWICE AND GAS IS WASTED
          App.setRevealButtonStatus(disable);
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
     }
};

$(function() {
     $(window).load(function() {
          App.init();
     });
});
