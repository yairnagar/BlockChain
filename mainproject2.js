const { BlockChain, Block, Transaction } = require('./BlockChainProject2');
const EC = require('elliptic').ec;
const { Wallet, SPV } = require("./WalletSPV");

const ec = new EC('secp256k1');

let net = new BlockChain();
const walletAlice = new Wallet();
const walletBob = new Wallet();
const trx = walletAlice.createTransaction(walletBob.address,50);
net.addTransaction(trx);
net.minePendingTransactions(walletAlice.address);


const spvNode = new SPV(net);


console.log('\n Start Mining');


console.log('\n My balance : ' + net.getBalance(walletAlice));

// Get the last mined block

const transactionFromAlice = net.getLatestBlock().transactions[0];
const isTransactionIncluded = spvNode.verifyTransactionInclusion(transactionFromAlice.calculateHash());
console.log("Is Transaction Included:", isTransactionIncluded);


// Search for tx1 in the blockchain
const txHashToSearch = trx.calculateHash();
const foundTransaction = net.searchTransaction(txHashToSearch);

// Output the result
if (foundTransaction) {
    console.log('Transaction found:', foundTransaction);
} else {
    console.log('Transaction not found.');
}
