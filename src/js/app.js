App = {
     web3Provider: null,
     contracts: {},
     account: 0x0,
     playerAddresses: [],
     pendingPlayers: [],

     init: function() {
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

         $('#account').text("MetaMask Chrome extension is disabled. Enable it to view account information and play.");
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
       //console.log('displayAccountInfo called');
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
         $('#accountBalance').text("To play, unlock MetaMask and reload site");
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
         App.updatePlayersInfo();
         App.getGameInfo();
         App.getPreviousPlayers();
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
         //console.log('playGame transaction successful, nonce: ' + _nonce);
       }).catch(function(err) {
         //transaction failed
         //console.log('transaction failed');
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

     getGameInfo: function() {
       //console.log('getGameInfo called');
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
         $('#winningNonce').text("Previous game winning map area: " + gameInformation[7]);
         $('#prize').text("Current game prize: " + web3.fromWei(gameInformation[9], "ether") + "Ξ");
         $('#callerIncentive').text("The reward for determining the winner is "
           + web3.fromWei(gameInformation[10], "ether") + "Ξ " + "and should be enough to cover the TX fee with moderate gas price.");
         $('#caller').text("Last user to reveal winner: " + gameInformation[11]);
         $('#callerIncentive2').text("The reward for determining the winner is "
           + web3.fromWei(gameInformation[10], "ether") + "Ξ " + "and should be enough to cover the TX fee with moderate gas price.");
       }).catch(function(err) {
       });
     },

     showModalIfFull: function() {
       //console.log('showModalIfFull called');
       App.contracts.Hashminer.deployed().then(function(instance) {
         return instance.getGameInfo();
       }).then(function(gameInformation) {
         // check that game is full
         if(gameInformation[3] == 16) {
           //console.log('game is full so call revealWinnerModalShow');
           setTimeout(function() {
             //console.log("3 block timer finished");
             // enable reveal winner alert on window
             App.revealWinnerModalShow()
           }, 1000);
         }
       }).catch(function(err) {
       });
     },

     // gets all players info, adds players to game and blocks nonces if they aren't already (this is the most important function for the game logic)
     getPreviousPlayers: function() {
       //console.log('getPreviousPlayers called');
       App.contracts.Hashminer.deployed().then(function(instance) {
         return instance.getPlayersInfo();
       }).then(function(playersInformation) {
         var receivedNonces = playersInformation[1];
         receivedNonces.forEach((element, index) => {
           element = parseInt(element);
           game.blockNonce(element);
           // generate x,y coordinates
           var previousCoordinates = App.generateCoordinates(element)
           var newConfirmedPlayer =  {"address":playersInformation[0][index],
           "nonce":element, "joined":"before", "x":previousCoordinates[0], "y":previousCoordinates[1]};
           game.addNewMiner(newConfirmedPlayer);
         });
       }).catch(function(err) {
       });
     },

     // update player addresses and nonces on table
     updatePlayersInfo: function() {
       App.contracts.Hashminer.deployed().then(function(instance) {
         return instance.getPlayersInfo();
       }).then(function(playersInformation) {
         App.playerAddresses = playersInformation[0];
         var playerNonces = playersInformation[1];
           $('#players-table > tbody').empty();
           App.playerAddresses.forEach((element, index) => {
             $('#players-table > tbody:last-child').append('<tr><td class="details">' + index + '</td><td class="details">' + element +
              '</td><td class="details">' + playerNonces[index] + '</td></tr>');
           });
         }).catch(function(err) {
       });
     },

     //generate random coordinates for a given nonce
     generateCoordinates: function(nonce) {
       do {
         var xcoordinate = Math.trunc(nonce/4) * 240 + Math.round(Math.random() * 11) * 20 + 10;
         //console.log(xcoordinate);
         var ycoordinate = (nonce % 4) * 138 + Math.round(Math.random() * 5) * 23 + 12;
         //console.log(ycoordinate);
       } while ((ycoordinate < 80) || (ycoordinate > 460) || (xcoordinate < 80) || (xcoordinate > 880));
       return [xcoordinate, ycoordinate];
     },

     // display window with reveal-winner button
     revealWinnerModalShow: function() {
       //console.log('revealWinnerModalShow called');
       // check that user account is playing
      if(App.playerAddresses.indexOf(App.account) != -1){
         //console.log('address playing');
        $('#revealModal').modal('show');
       }
     },

     // display window with reveal-winner button
     revealWinnerModalHide: function() {
       // check that user account is playing
      $('#revealModal').modal('hide');
     },

     // listen to events triggered by the contract
     listenToEvents: function() {
       App.contracts.Hashminer.deployed().then(function(instance) {

         // listen to LogPlayerAdded event
        instance.LogPlayerAdded({}, {}).watch(function(error, event) {
          console.log('received player added event');
          if (!error) {
            // get new player nonce
            var newPlayerFromEvent = {address: event.args._wallet, nonce: event.args._nonce};
            game.blockNonce(newPlayerFromEvent.nonce);
            var pendingIndex;
            //check if any element in pendingPlayers is equal to the new confirmed player
            App.pendingPlayers.forEach((element, index) => {
              if(element.nonce == newPlayerFromEvent.nonce && element.address == newPlayerFromEvent.address) {
                // save array index
                pendingIndex = index;
              }
            });
            // if new player was pending, place on map with the saved coordinates and remove from pendingPlayers
            if(pendingIndex > -1){
              console.log('pending player is now confirmed');
              console.log('new player is: ' + App.pendingPlayers[pendingIndex]);
              // add to map
              game.addNewMiner(App.pendingPlayers[pendingIndex]);
              // remove from pending players array
              App.pendingPlayers.splice(pendingIndex, 1);
            } else {
              console.log('confirmed player was not pending');
              // generate random coordinates for the nonce
              var newCoordinates = App.generateCoordinates(newPlayerFromEvent.nonce);
              // create a new player object
              newPlayerFromEvent.x = newCoordinates[0];
              newPlayerFromEvent.y = newCoordinates[1];
              // pass to game to add player to map
              game.addNewMiner(newPlayerFromEvent);
            }
            // update game, players and account information
            App.getGameInfo();
            App.updatePlayersInfo();
            App.displayAccountInfo();
          } else {
            console.error(error);
          }
        });

        // listen to LogPlayersReady event
       instance.LogPlayersReady({}, {}).watch(function(error, event) {
         if (!error) {
           //console.log('Players ready. Starting timer for 3 blocks');
           var playersReadyTimer = setTimeout(function() {
             //console.log("3 block timer finished");
             // enable reveal winner alert on window
             App.revealWinnerModalShow()
           }, 60000);
         } else {
           console.error(error);
         }
       });

       // listen to LogGameFinished event
      instance.LogGameFinished({}, {}).watch(function(error, event) {
        if (!error) {
          console.log('received game finished event');
          console.log('event information: ' + JSON.stringify(event.args._winningNonce));
          // hide reveal modal
          App.revealWinnerModalHide();
          // update account, game and players information
          App.updatePlayersInfo();
          App.getGameInfo();
          App.displayAccountInfo();
          game.animateFinal(event.args._winningNonce);
        } else {
          console.error(error);
        }
      });

      // listen to LogGameOptionsSet event
     instance.LogGameOptionsSet({}, {}).watch(function(error, event) {
       if (!error) {
         // update game information
         App.getGameInfo();
       } else {
         console.error(error);
       }
     });

     // listen to LogGameLock event
    instance.LogGameLock({}, {}).watch(function(error, event) {
      if (!error) {
        // update game information
        App.getGameInfo();
      } else {
        console.error(error);
      }
    });
  });
}
}

$(function() {
     $(window).on('load', function() {
          App.init();
     });
});
