import BigNumber from 'bignumber.js'
import web3 from '../blockchain/web3.js'

BigNumber.set({
  DECIMAL_PLACES: 17,
  EXPONENTIAL_AT: 1e+9
})
export default BigNumber

export async function gasToBNB (gas, gasPrice) {
  if (!gasPrice) gasPrice = await web3.eth.getGasPrice()
  const exp = gas * web3.utils.fromWei(gasPrice, 'gwei') * 1.01
  return web3.utils.toWei(Math.round(exp).toString(), 'gwei')
}
