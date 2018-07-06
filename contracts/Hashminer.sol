pragma solidity ^0.4.19;

contract Hashminer {
  // custom types
  struct Player {
  uint nonce;
  address wallet;
  }

  // state variables
  address owner;
  bool gameLocked;
  uint maxNumberOfPlayers = 16; // must be 2^N
  mapping (uint => Player) public players;
  uint[65] takenNonces; // array size must be at least maxNumberOfPlayers+1
  uint playerCounter;
  uint gameCost = 50 finney;
  uint blockNumber;
  bytes32 blockHash;
  uint winningNonce;
  address winner;
  uint prize = 798 finney;
  uint callerIncentive = 2 finney;
  address caller;

  // events
  event LogGameLock(
    bool _gameLocked
  );
  event LogPlayerAdded(
    uint _playerCounter,
    uint _nonce,
    address _wallet
  );
  event LogPlayersReady(
    uint _blockNumber
  );
  event LogGameFinished(
    uint _blockNumber,
    bytes32 _blockHash,
    uint _winningNonce,
    address _winner,
    address _caller,
    bool _gameLocked
  );

  // constructor
  function Hashminer() public {
    owner = msg.sender;
  }

  // deactivate the contract
  function kill() public {
    // only allow the contract owner
    require(msg.sender == owner);

    // check that game is locked and not active. This ensures deactivation is only possible when game is inactive
    require(gameLocked && (playerCounter == 0));

    selfdestruct(owner);
  }

  // lock or unlock game after current game ends for game option changes and front-end updates
  function lockGame() public {
    // only allow the contract owner
    require(msg.sender == owner);

    // lock/unlock game
    gameLocked = !gameLocked;
    LogGameLock(gameLocked);
  }

  // add player to the game
  function playGame(uint _nonce) payable public {
    // check that value transferred matches the cost to play
    require(msg.value == gameCost);

    // check that game is unlocked or already active
    require((!gameLocked) || (playerCounter > 0));

    // check that the nonce is within the accepted range of values
    require((0 <= _nonce) && (_nonce < maxNumberOfPlayers));

    // check that the nonce has not been taken. This also checks that the game is not full.
    for (uint i = 0; i < playerCounter; i++) {
      if (_nonce == takenNonces[i]) {revert();}
    }

    // add nonce to list of already chosen ones.
    takenNonces[playerCounter] = _nonce;

    // save player struct with nonce and address in players[]
    players[_nonce] = Player(_nonce, msg.sender);

    LogPlayerAdded(playerCounter, _nonce, msg.sender);

    // add new player
    playerCounter++;

    // save number of the block that will determine the winner if game is full
    if (playerCounter == maxNumberOfPlayers) {
      blockNumber = block.number + 3;
      LogPlayersReady(blockNumber);
    }
  }

  // reveal game winner, transfer the prize and the reward to the caller
  function revealWinner() public {
    // check that game is full
    require(playerCounter == maxNumberOfPlayers);

    // check that the block that determines the winner has been mined
    require(block.number > blockNumber);

    // obtain hash of the block that determined the winner
    blockHash = block.blockhash(blockNumber);

    // obtain winning nonce. The desired blockHash ending for a given nonce is varied each game
    winningNonce = (uint(keccak256(blockNumber, blockHash)) & (maxNumberOfPlayers - 1));

    // transfer prize to winning player
    winner = players[winningNonce].wallet;
    winner.transfer(prize);

    // reset playerCounter
    playerCounter = 0;

    // store the caller address and transfer their reward
    caller = msg.sender;
    caller.transfer(callerIncentive);
    LogGameFinished(blockNumber, blockHash, winningNonce, winner, caller, gameLocked);
  }

  // get game information
  function getGameInfo() public view returns (
    address _owner,
    bool _gameLocked,
    uint _maxNumberOfPlayers,
    uint _playerCounter,
    uint _gameCost,
    uint _blockNumber,
    bytes32 _blockHash,
    uint _winningNonce,
    address _winner,
    uint _prize,
    uint _callerIncentive,
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
      winner,
      prize,
      callerIncentive,
      caller);
  }

  // get current players information
  function getPlayersInfo() public view returns (address[], uint[]) {
    // prepare output arrays
    address[] memory playerAddresses = new address[](playerCounter);
    uint[] memory playerNonces = new uint[](playerCounter);

    // iterate over all taken nonces
    for(uint i = 0; i < playerCounter;  i++) {
      // save player addresses and nonces
      playerAddresses[i] = players[takenNonces[i]].wallet;
      playerNonces[i] = players[takenNonces[i]].nonce;
    }

    return (playerAddresses, playerNonces);
  }

}
