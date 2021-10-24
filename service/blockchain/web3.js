import Web3 from 'web3'

// TODO: Choose working blockchain node and switch if there was error
const web3 = new Web3(process.env.BLOCKCHAIN_NODE)
export default web3
