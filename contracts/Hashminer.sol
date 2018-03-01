pragma solidity ^0.4.18;

contract Hashminer {
  // custom types
  struct Account {
    address wallet;
    uint256 balance;
  }

  struct Player {
    uint8 id;
    uint8 nonce;
    address wallet;
  }

  // state variables
  mapping (address => Account) public accounts;
  mapping (uint8 => Player) public players;
  uint8 maxNumberOfPlayers = 16;
  uint8 playerCounter;
  uint256 gameCost = 50 finney;
  uint blockNumber;
  bytes32 blockHash;
  uint8 winningNonce;
  uint8 numberOfWinningPlayers;
  uint[17] prizeAmounts = [
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
    54 finney,
    51 finney,
    48 finney ];
  uint256 playerPrize;
  uint256 callerIncentive = 2 finney;
  address caller;


  // events
  event LogAccountDeposit(
    address _wallet,
    uint _depositAmount,
    uint _balance
  );
  event LogAccountWithdraw(
    address _wallet,
    uint _withdrawAmount,
    uint _balance
  );
  event LogPlayerAdded(
    uint _playerCounter,
    uint8 _nonce,
    address wallet)
  );
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


  // deposit funds to account
  function depositFunds() payable public {
    // update balance
    accounts[msg.sender].balance += msg.value;
    LogAccountDeposit(msg.sender, msg.value, accounts[msg.sender].balance);
  }

  // withdraw funds from account
  function withdrawFunds(uint _withdrawAmount) payable public {
    // check that player has sufficient funds
    require(accounts[msg.sender].balance >= _withdrawAmount);

    // update balance and transfer funds
    accounts[msg.sender].balance -= _withdrawAmount;
    msg.sender.transfer(_withdrawAmount);
    LogAccountWithdraw(msg.sender, msg.value, accounts[msg.sender].balance);
  }

  // check account balance
  function getAccountBalance() public view returns (uint _balance) {
    return(accounts[msg.sender].balance);
  }

  // play betting game
  function playGame(uint8 _nonce) payable public {
    // check that game is active
    require(playerCounter < maxNumberOfPlayers);

    // check that account has enough funds and update balance
    require(accounts[msg.sender].balance >= gameCost);
    accounts[msg.sender].balance -= gameCost;

    // add new player
    playerCounter++; //Sebastien left also left this counter before adding article. Ensures no players are ever added without adding to counter?
    players[playerCounter] = Player(playerCounter, _nonce, msg.sender);
    LogPlayerAdded(playerCounter, _nonce, msg.sender);

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

    // obtain winning nonce (last 4 bits of the blockHash)
    // this varies the desired blockHash ending each game for a given nonce
    winningNonce = uint8(keccak256(blockNumber, blockHash)) & 0xF;

    // prepare output array
    address[] memory winningPlayers = new address[](maxNumberOfPlayers);

    // determine winning players
    numberOfWinningPlayers = 0;
    for (uint8 i = 1; i <= maxNumberOfPlayers;  i++) {
      if (players[i].nonce == winningNonce) {
        numberOfWinningPlayers++;
        // store winning player's address
        winningPlayers[numberOfWinningPlayers] = players[i].wallet;
      }
    }

    // calculate prize per player
    playerPrize = prizeAmounts[numberOfWinningPlayers];

    // update balance of winning accounts
    for (uint8 j = 1; j <= numberOfWinningPlayers; j++) {
      accounts[winningPlayers[j]].balance += playerPrize;
    }

    // reset playerCounter to restart game
    playerCounter = 0;

    LogGameFinished(blockNumber, winningNonce, numberOfWinningPlayers, playerPrize, caller);

    // store the caller and transfer reward
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
