import web3 from './web3';
import Hashminer from './build/contracts/Hashminer.json';

const instance = new web3.eth.Contract(
  JSON.parse(Hashminer.interface),
  '0x190D632Dfa964BDF8108d05F87e8e59b97931E7F'
);

export default instance;
