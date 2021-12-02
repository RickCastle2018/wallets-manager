import web3 from '../blockchain/web3.js'

export default async function gasToBNB (gas) {
  const gasPrice = await web3.eth.getGasPrice()
  const exp = gas * web3.utils.fromWei(gasPrice, 'gwei') * 1.01
  return web3.utils.toWei(Math.round(exp).toString(), 'gwei')
}
