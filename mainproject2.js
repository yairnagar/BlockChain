const { BlockChain, Block, Transaction } = require('./BlockChainProject2');
const EC = require('elliptic').ec;
const { Wallet, SPV } = require("./WalletSPV");
const fs = require('fs');
const {MemPool} = require('./MemPool');

const ec = new EC('secp256k1');


// function getRandomInt(min, max) {
//   return Math.floor(Math.random() * (max - min + 1)) + min;
// }
// const wallets = [];
// for(let i=0; i<5; i++){
//     wallets.push(new Wallet());
// }

// const transactions = [];
// const signatures = [];

// for(let i=0; i<30; i++){
//     fromWallet = wallets[getRandomInt(0,4)];
//     toWallet = wallets[getRandomInt(0,4)];
//     while(fromWallet == toWallet){
//         fromWallet = wallets[getRandomInt(0,4)];
//     }
//     const trx = fromWallet.createTransaction(toWallet.address, getRandomInt(1,200));

//     const transactionData = {
//         fromAddress: trx.fromAddress,
//         toAddress: trx.toAddress,
//         amount: trx.amount,
//         timestamp: trx.timestamp,
//         hashTx: trx.hashTx
//     };

//     const signatureData = {
//         hashTx: trx.hashTx,
//         signature: trx.signature,
//     };

//     transactions.push(transactionData);
//     signatures.push(signatureData);
// }
// fs.writeFileSync('./sample-transactions.json', JSON.stringify(transactions));

// fs.writeFileSync('./sample-signatures.json', JSON.stringify(signatures));

const mempool = new MemPool();

console.log(mempool.transactions);



// let net = new BlockChain();
// const walletAlice = new Wallet();
// const walletBob = new Wallet();
// const trx = walletAlice.createTransaction(walletBob.address,50);
// net.addTransaction(trx);
// net.minePendingTransactions(walletAlice.address);


// const spvNode = new SPV(net);


// console.log('\n Start Mining');


// console.log('\n My balance : ' + net.getBalance(walletAlice));

// // Get the last mined block

// const transactionFromAlice = net.getLatestBlock().transactions[0];
// const isTransactionIncluded = spvNode.verifyTransactionInclusion(transactionFromAlice.calculateHash());
// console.log("Is Transaction Included:", isTransactionIncluded);



// // Search for tx1 in the blockchain
// const txHashToSearch = trx.calculateHash();
// const foundTransaction = net.searchTransaction(txHashToSearch);

// // Output the result
// if (foundTransaction) {
//     console.log('Transaction found:', foundTransaction);
// } else {
//     console.log('Transaction not found.');
// }
