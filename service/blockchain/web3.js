import Web3 from 'web3'

// TODO: Choose working blockchain node and switch if there was error
// also, use promise and wait for connection init
const web3 = new Web3(process.env.BLOCKCHAIN_NODE)
export default web3

// TODO: timeouts and auto connection recovery (UnhandledPromiseRejectionWarning: Error: Invalid JSON RPC response: "")
