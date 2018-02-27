pragma solidity ^0.4.18;

contract Hashminer {
  // custom types
  struct Player {
    uint8 id;
    address wallet;
    uint8 nonce;
  }

  // state variables
  mapping (uint8 => Player) public players;
  uint8 maxNumberOfPlayers = 16;
  uint8 playerCounter;
  uint256 gameCost = 50 finney;
  uint blockNumber;
  bytes32 blockHash;
  uint8 winningNonce;
  uint8 numberOfWinningPlayers;
  uint[16] prizeAmounts = [
    0,
    760 finney,
    380 finney,
    253 finney,
    190 finney,
    152 finney,
    127 finney,
    109 finney,
    95 finney,
    84 finney,
    76 finney,
    69 finney,
    63 finney,
    58 finney,
    51 finney,
    48 finney ]; // change this to handle arbitrary number of players. There's probably a better solution.
  uint256 playerPrize;
  uint256 callerIncentive = 2 finney;
  address caller;


  // events
  event LogPlayersReady(
    uint _blockNumber
  );
  event LogGameFinished(
    uint _blockNumber,
    uint8 _winningNonce,
    uint8 _numberOfWinningPlayers,
    uint256 _playerPrize,
    address _caller
  );


  // play betting game
  function playGame(uint8 _nonce) payable public {
    // check that game is active
    require(playerCounter < maxNumberOfPlayers);

    // check that value equals gameCost
    require(msg.value == gameCost);

    // add new player
    playerCounter++; //Sebastien left also left this counter before adding article. Ensures no players are ever added without adding to counter?
    players[playerCounter] = Player(playerCounter, msg.sender, _nonce);

    // save number of the block that will determine the winner
    if (playerCounter == maxNumberOfPlayers) {
      blockNumber = block.number + 3;
      LogPlayersReady(blockNumber);
    }
  }

  // determine game winner
  function determineWinner() payable public {
    // check that game is set
    require(playerCounter == maxNumberOfPlayers);

    // check that block that defines game has been mined
    require(block.number > blockNumber);

    // obtain hash of the block that determined the winner
    blockHash = block.blockhash(blockNumber);

    // obtain wining nonce (last 4 bits of the blockHash)
    winningNonce = uint8(blockHash) & 0xF;

    // determine how many and which players won
    numberOfWinningPlayers = 0;
    for (uint8 i = 1; i <= maxNumberOfPlayers;  i++) {
      if (players[i].nonce == winningNonce) {
      numberOfWinningPlayers++;
      }
    }

    // calculate prize per player
    playerPrize = prizeAmounts[numberOfWinningPlayers]; // dividing produces an error. No events were produced after adding this line.

    // pay each winning player
    uint8 j = 1;
    while (j <= maxNumberOfPlayers) { //This can be made more efficient by ending loop after last winner is paid
      if (players[j].nonce == winningNonce){
        players[j].wallet.transfer(playerPrize);
      }
      j++;
    }

    // reset playerCounter to restart game
    playerCounter = 0;

    LogGameFinished(blockNumber, winningNonce, numberOfWinningPlayers, playerPrize, caller);

    // record the caller and transfer reward
    caller = msg.sender;
    caller.transfer(callerIncentive);
  }

  // get game information
  function getGameInfo() public view returns (
    uint8 _playerCounter,
    uint256 _gameCost,
    uint _blockNumber,
    bytes32 _blockHash,
    uint8 _winningNonce,
    uint8 _numberOfWinningPlayers,
    uint256 _playerPrize,
    uint256 _callerIncentive,
    address _caller
    ) {
    return(
      playerCounter,
      gameCost,
      blockNumber,
      blockHash,
      winningNonce,
      numberOfWinningPlayers,
      playerPrize,
      callerIncentive,
      caller);
  }

}
