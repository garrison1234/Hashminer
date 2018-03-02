pragma solidity ^0.4.18;

contract Hashminer {
  // custom types
  struct Account {
    address wallet;
    uint256 balance;
  }

  struct Player {
    uint8 nonce;
    address wallet;
  }

  // state variables
  address owner;
  bool gameLocked;
  mapping (address => Account) public accounts;
  mapping (uint8 => Player) public players;
  uint8 maxNumberOfPlayers;
  uint8[16] takenNonces;
  uint8 playerCounter;
  uint256 gameCost;
  uint blockNumber;
  bytes32 blockHash;
  uint8 winningNonce;
  address winner;
  uint256 prize;
  uint256 houseFee;
  uint256 houseBalance;
  uint256 callerIncentive;
  address caller;


  // events
  event LogGameLock(
    bool _gameLocked
  );
  event LogGameOptionsSet(
    uint8 _maxNumberOfPlayers,
    uint256 _gameCost,
    uint256 _prize,
    uint256 _houseFee,
    uint256 _callerIncentive
  );
  event LogHouseWithdraw(
    address _wallet,
    address _wallet2,
    uint _withdrawAmount,
    uint houseBalance
  );
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
    address wallet
  );
  event LogPlayersReady(
    uint _blockNumber
  );
  event LogGameFinished(
    uint _blockNumber,
    bytes32 _blockHash,
    uint8 _winningNonce,
    address _winner,
    uint256 _winnerBalance,
    uint256 _houseBalance,
    address _caller,
    uint256 _callerBalance,
    bool _gameLocked
  );

  // constructor
  function Hashminer() public {
    owner = msg.sender;
  }

  // lock or unlock game after current game ends for game option changes and front-end updates
  function lockGame() public {
    // only allow the contract owner
    require(msg.sender == owner);

    // lock/unlock game
    gameLocked = !gameLocked;
    LogGameLock(gameLocked);
  }

  // change game settings
  function setGameOptions(uint8 _maxNumberOfPlayers, uint256 _gameCost,
    uint256 _prize, uint256 _houseFee, uint256 _callerIncentive) public {
    // only allow the contract owner to make changes
    require(msg.sender == owner);

    // check that game is locked and not active. This ensures game rules are not changed during game
    require(gameLocked && (playerCounter == 0));

    // change game settings
    maxNumberOfPlayers = _maxNumberOfPlayers;
    gameCost = _gameCost;
    prize = _prize;
    houseFee = _houseFee;
    callerIncentive = _callerIncentive;
    LogGameOptionsSet(maxNumberOfPlayers, gameCost, prize, houseFee, callerIncentive);
  }

  // transfer funds from house to given an address
  function houseWithdraw(uint _withdrawAmount, address _wallet) public {
    // only allow the contract owner to withdraw
    require(msg.sender == owner);

    // check that house funds are sufficient for the withdrawal
    require(houseBalance >= _withdrawAmount);

    // check that game is locked and not active. This ensures there will be enough funds to pay the game winner
    require(gameLocked && (playerCounter == 0));

    // transfer to  address _wallet
    _wallet.transfer(_withdrawAmount);

    // update house balance
    houseBalance -= _withdrawAmount;
    LogHouseWithdraw(msg.sender, _wallet, _withdrawAmount, houseBalance);
  }

  // deposit funds to account
  function depositFunds() payable public {
    // update balance
    accounts[msg.sender].balance += msg.value;
    LogAccountDeposit(msg.sender, msg.value, accounts[msg.sender].balance);
  }

  // withdraw funds from account
  function withdrawFunds(uint _withdrawAmount) public {
    // check that player has sufficient funds
    require(accounts[msg.sender].balance >= _withdrawAmount);

    // update balance and transfer funds
    accounts[msg.sender].balance -= _withdrawAmount;
    msg.sender.transfer(_withdrawAmount);
    LogAccountWithdraw(msg.sender, _withdrawAmount, accounts[msg.sender].balance);
  }

  // check account balance
  function getAccountBalance() public view returns (uint _balance) {
    return(accounts[msg.sender].balance);
  }

  // play betting game
  function playGame(uint8 _nonce) public {
    // check that game has not been locked or that the game is already active
    require((!gameLocked) || (playerCounter > 0));

    // check that game is not full
    require(playerCounter < maxNumberOfPlayers);

    // check that the nonce has not been chosen
    for (uint8 i = 1; i <= playerCounter; i++) {
      require(_nonce != takenNonces[i]);
    }

    // check that account has enough funds and update balance
    require(accounts[msg.sender].balance >= gameCost);
    accounts[msg.sender].balance -= gameCost;

    // add new player
    playerCounter++;
    players[_nonce] = Player(_nonce, msg.sender);

    // add nonce to list of chosen ones for this game
    takenNonces[playerCounter] = _nonce;

    LogPlayerAdded(playerCounter, _nonce, msg.sender);

    // save number of the block that will determine the winner
    if (playerCounter == maxNumberOfPlayers) {
      blockNumber = block.number + 3;
      LogPlayersReady(blockNumber);
    }
  }

  // determine game winner
  function revealWinner() public {
    // check that game is set
    require(playerCounter == maxNumberOfPlayers);

    // check that the block that determines the winner has been mined
    require(block.number > blockNumber);

    // obtain hash of the block that determined the winner
    blockHash = block.blockhash(blockNumber);

    // obtain winning nonce. The desired blockHash ending for a given nonce is varied each game
    winningNonce = uint8(keccak256(blockNumber, blockHash)) & 0xF;

    // update balance of account whose player won
    winner = players[winningNonce].wallet;
    accounts[winner].balance += prize;

    // add house fee to house balance
    houseBalance += houseFee - callerIncentive;

    // reset playerCounter to restart game
    playerCounter = 0;

    // store the caller address and add reward to their balance
    caller = msg.sender;
    accounts[caller].balance += callerIncentive;
    LogGameFinished(blockNumber, blockHash, winningNonce, winner, accounts[winner].balance,
      houseBalance, caller, accounts[caller].balance, gameLocked);
  }

  // get game information
  function getGameInfo() public view returns (
    address _owner,
    bool _gameLocked,
    uint8 _maxNumberOfPlayers,
    uint8 _playerCounter,
    uint256 _gameCost,
    uint _blockNumber,
    bytes32 _blockHash,
    uint8 _winningNonce,
    uint256 _prize,
    uint256 _houseFee,
    uint256 _houseBalance,
    uint256 _callerIncentive,
    address _caller
    ) {
    return(
      owner,
      gameLocked,
      maxNumberOfPlayers,
      playerCounter,
      gameCost,
      blockNumber,
      blockHash,
      winningNonce,
      prize,
      houseFee,
      houseBalance,
      callerIncentive,
      caller);
  }

}
