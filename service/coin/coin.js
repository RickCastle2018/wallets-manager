import { readFileSync } from 'fs';
import web3 from './web3.js';

const abi = JSON.parse(readFileSync('./coin/contracts/oglc.json', 'utf8'));
const coin = new web3.eth.Contract(abi, process.env.COIN_CONTRACT);

export default coin
