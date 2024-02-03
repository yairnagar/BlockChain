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
// const myKey = ec.keyFromPrivate('887d2b0cda814cb25830007b18b2c60a5450529cebd13654b654101bdcf6e717');

// const myWalletAddress = myKey.getPublic('hex');

// const tx1 = new Transaction(myWalletAddress, 'address2', 100);
// tx1.signTransaction(myKey);

// yairNet.addTransaction(tx1);

// const tx2 = new Transaction(myWalletAddress, 'address1', 50);
// tx2.signTransaction(myKey);

// yairNet.addTransaction(tx2);

console.log('\n Start Mining');

// yairNet.minePendingTransactions(myWalletAddress);

console.log('\n My balance : ' + net.getBalance(walletAlice));

// Get the last mined block
// const minedBlock = yairNet.getLatestBlock();

const transactionFromAlice = net.getLatestBlock().transactions[0];
const isTransactionIncluded = spvNode.verifyTransactionInclusion(transactionFromAlice.calculateHash());
console.log("Is Transaction Included:", isTransactionIncluded);

// Verify inclusion of tx1 in the mined block using the Merkle root
// const isTx1Included = minedBlock.verifyTransactionInclusion(tx1.calculateHash());


// Output the result
// console.log('Verification result:', isTx1Included);

// Search for tx1 in the blockchain
const txHashToSearch = trx.calculateHash();
const foundTransaction = net.searchTransaction(txHashToSearch);

// Output the result
if (foundTransaction) {
    console.log('Transaction found:', foundTransaction);
} else {
    console.log('Transaction not found.');
}
