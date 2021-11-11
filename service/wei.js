import web3 from './blockchain/web3.js'

const price = Math.round(web3.utils.toWei('250000', 'gwei') * 2 * 650 * 1.1)
console.log(web3.utils.fromWei(price.toString()))
