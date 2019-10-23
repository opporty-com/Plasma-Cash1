/**
 * Created by Oleksandr <alex@moonion.com> on 2019-08-06
 * moonion.com;
 */

import * as ethUtil from 'ethereumjs-util';
import * as Transaction from '../models/Transaction';

async function deposit({depositor: owner, tokenId, amount, blockNumber}) {

  // logger.info(`receive new deposit token: ${tokenId} owner: ${owner}`);
  let tx = {
    prevHash: ethUtil.toBuffer(ethUtil.addHexPrefix(owner)),
    prevBlock: 0,
    tokenId,
    newOwner: ethUtil.toBuffer(ethUtil.addHexPrefix(owner)),
    type: Transaction.TYPES.PAY,
    dataLength: 0,
    data: ethUtil.toBuffer(''),
    totalFee: "1",
    fee: "1",
  };
  tx = Transaction.sign(tx);
  await add(tx);
  return Transaction.getBuffer(tx)
}


async function add(tx) {
  const isValid = await Transaction.validate(tx);
  if (!isValid) throw new Error('The transaction is not valid');

  tx.blockNumber = 0;
  tx.timestamp = (new Date()).getTime();
  await Transaction.pushToPool(tx);
  return tx;
}


async function send(transaction) {
  const tx = await add(transaction);
  return Transaction.getBuffer(tx)
}


async function getPool() {
  const transactions = await Transaction.getPool();
  return transactions.map(tx => Transaction.getJson(tx));
}

async function getPoolSize() {
  return await Transaction.getPoolSize();
}

async function get(hash) {
  const tx = await Transaction.get(hash);
  if (!tx) throw new Error('The Transaction not found');
  return Transaction.getJson(tx);
}


async function count() {
  return await Transaction.count();
}

async function getTransactionsByAddress(address) {
  const transactions = await Transaction.getByAddress(address);
  return transactions.map(tx => Transaction.getJson(tx));
}

export {
  send,
  add,
  get,
  deposit,
  getPool,
  getPoolSize,
  getTransactionsByAddress,
  count
}
