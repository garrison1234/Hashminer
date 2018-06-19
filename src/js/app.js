App = {
     web3Provider: null,
     contracts: {},
     account: 0x0,

     init: function() {
        // block revealWinner button upon loading
        $('#reveal-button').prop('disabled', true);
        return App.initWeb3();
     },

     // initialize web3 provider
     initWeb3: function() {
       // initialize web3
       if(typeof web3 !== 'undefined') {
         //reuse the provider of the Web3 object injected by Metamask
         App.web3Provider = web3.currentProvider;

         App.displayAccountInfo();
       } else {
         //create a new provider and plug it directly into our local node
         //App.web3Provider = new Web3.providers.HttpProvider('http://localhost:7545');
         App.web3Provider = new Web3.providers.HttpProvider('https://rinkeby.infura.io/LkO37PKVOQPojiMpZpPO');

         $('#account').text("MetaMask Chrome extension is disabled. Enable it to view account information");
         $('#account').css('color', '#DC3546');
         $('#accountBalance').text("To get MetaMask, click ");
         $('#metaMaskLink').text("here");
         $('#otherTab').prop('disabled', false);
       }
       web3 = new Web3(App.web3Provider);

       return App.initContract();
     },

     // display the user's ETH account and balance
     displayAccountInfo: function() {
       console.log('displayAccountInfo called');
       web3.eth.getCoinbase(function(err, account) {
         if(err === null) {
           App.account = account;
           $('#account').text("Account: "+ account);
           $('#account').css('color', '	#5b99a4');
           web3.eth.getBalance(account, function(err, balance) {
             if(err === null) {
               $('#accountBalance').css('color', '	#5b99a4');
               $('#accountBalance').text("Balance: " + web3.fromWei(balance, "ether") + "Ξ");
             }
           })
         }
       });
       if(App.account == 0){
         $('#account').css('color', '	#FEC106');
         $('#account').text('');
         $('#accountBalance').css('color', '	#FEC106');
         $('#accountBalance').text("To view account information, unlock MetaMask and reload site");
       }
     },

     // retrieve the Hashminer contract
     initContract: function() {
       $.getJSON("/contracts/Hashminer.json", function(hashminerArtifact) {
         // get the contract artifact file and use it to instantiate a truffle contract abstraction
         App.contracts.Hashminer = TruffleContract(hashminerArtifact);
         // set the provider for our contracts
         App.contracts.Hashminer.setProvider(App.web3Provider);
         //listen to events
         App.listenToEvents();
         // displays all information
         App.displayGameInfo();
         App.displayPlayersInfo();
       });
     },

     playGame: function(_nonce) {
       App.contracts.Hashminer.deployed().then(function(instance) {
         console.log('request transaction with nonce: ' + _nonce);
         return instance.playGame(_nonce, {
           from: App.account,
           value: web3.toWei(50, "finney"),
           gas: 500000
         });
       }).then(function(result) {
         //transaction was mined
         console.log('playGame transaction successful, nonce: ' + _nonce);
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
       console.log('displayGameInfo called');
       App.contracts.Hashminer.deployed().then(function(instance) {
         return instance.getGameInfo();
       }).then(function(gameInformation) {
         // retrieve the game information from the contract.
         $('#contractAddress').text(App.contracts.Hashminer.address)
         $('#owner').text(gameInformation[0]);
         $('#gameLocked').text(gameInformation[1]);
         $('#maxNumberOfPlayers').text("The game is full once " + gameInformation[2] + " have players joined");
         $('#maxNumberOfPlayers2').text("The game is full once " + gameInformation[2] + " have players joined");
         $('#playerCounter').text("Players currently in game: " + gameInformation[3]);
         $('#gameCost').text("Cost to play: " + web3.fromWei(gameInformation[4], "ether") + "Ξ");
         $('#blockNumber').text("Number of block that determined winner: " +gameInformation[5]);
         //$('#blockHash').text("Block Hash: " + gameInformation[6].substring(0, 10) + "...");
         $('#winner').text("Previous game winner: " + gameInformation[8]);
         $('#winningNonce').text("Previous game winning nonce: " + gameInformation[7]);
         $('#prize').text("Current game prize: " + web3.fromWei(gameInformation[9], "ether") + "Ξ");
         $('#callerIncentive').text("The reward for determining the winner is "
           + web3.fromWei(gameInformation[10], "ether") + "Ξ " + "and should be enough to cover the TX fee with moderate gas price.");
         $('#caller').text("Last user to reveal winner: " + gameInformation[11]);
         $('#callerIncentive2').text("The reward for determining the winner is "
           + web3.fromWei(gameInformation[10], "ether") + "Ξ " + "and should be enough to cover the TX fee with moderate gas price.");
       }).catch(function(err) {
       });
     },

     displayPlayersInfo: function() {
       console.log('displayPlayersInfo called');
       App.contracts.Hashminer.deployed().then(function(instance) {
         return instance.getPlayersInfo();
       }).then(function(playersInformation) {
         $('#players-table > tbody').empty();
         for(i = 0; i < (playersInformation[0].length); i++) {
           $('#players-table > tbody:last-child').append('<tr><td><p class="details">' + playersInformation[0][i] +
            '</p></td><td><p class="details">' + playersInformation[1][i] + '</p></td></tr>');
         }
       }).catch(function(err) {
       });

     },

     /*displayModal: function() {
       console.log('displayModal called');
       $('#revealModal').modal('show');

     },*/

     // listen to events triggered by the contract
     listenToEvents: function() {
       App.contracts.Hashminer.deployed().then(function(instance) {

         // listen to LogPlayerAdded event
        instance.LogPlayerAdded({}, {}).watch(function(error, event) {
          console.log('received player added event');
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
           $('#reveal-button').prop('disabled', false);
           App.displayGameInfo();
         } else {
           console.error(error);
         }
       });

       // listen to LogGameFinished event
      instance.LogGameFinished({}, {}).watch(function(error, event) {
        if (!error) {
          console.log('received game finished event');
          console.log('event information: ' + JSON.stringify(event.args._winningNonce));
          $('#reveal-button').prop('disabled', true);
          // update account, game and players information
          App.displayPlayersInfo();
          App.displayGameInfo();
          App.displayAccountInfo();
          Client.animateFinal(event.args._winningNonce);
          console.log('call Client.animateFinal with winningNonce: ' + event.args._winningNonce);
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
     $(window).on('load', function() {
          App.init();
     });
});
