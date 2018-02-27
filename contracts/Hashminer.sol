pragma solidity ^0.4.18;

contract Hashminer {
  // state variables
  address player;
  uint8 betNumber;
  uint256 betAmount;
  uint256 blockNumber;
  bytes32 blockHash;
  uint8 win;

  // play betting game
  function playGame(uint8 _betNumber) payable public {
    player = msg.sender;
    betNumber = _betNumber;
    betAmount = msg.value;
    blockNumber = block.number + 3;
  }

  // determine game winner
  function determineWinner() payable public {
    require(block.number > blockNumber);
    blockHash = block.blockhash(blockNumber);
    win = (((betNumber ^ uint8(blockHash)) & 0xF) == 0 ? 2 : 1 );
    if(win == 2){
      player.transfer(betAmount);
    }
  }

  // get game information
  function getGameInfo() public view returns (
    address _player,
    uint8 _betNumber,
    uint256 _betAmount,
    uint256 _blockNumber,
    bytes32 _blockHash,
    uint8 _win
    ) {
    return(player, betNumber, betAmount, blockNumber, blockHash, win);
  }

}
