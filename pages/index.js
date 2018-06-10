import React, { Component } from 'react';
import Hashminer from '../Hashminer';

class PlayerIndex extends Component {
  async componentdidMount() {
    const playersInfo = await Hashminer.methods.getPlayersInfo().call();

    console.log(playersInfo);
  }

  render() {
    return <div>Players Info!</div>
  }
}

export default PlayerIndex;
