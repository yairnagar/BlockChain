const { Wallet, SPV } = require("./WalletSPV");
const { BlockChain, Block, Transaction } = require('./BlockChainProject2');


console.log("creating new Blockchain instance")
let blockchainInstance = new BlockChain();

console.log("creating bob's and alice's wallets")
const walletAlice = new Wallet();
const walletBob = new Wallet();

console.log("transaferring from alice to bob");
const trx = walletAlice.createTransaction(walletBob.address,50);
const parsedTransaction = JSON.stringify(trx);
console.log(`transaction's details: ${parsedTransaction}`);

console.log("adding transaction to mempool")
blockchainInstance.addTransaction(trx);

console.log("Starting the miner and mining the block");
const walletMiner = new Wallet();
blockchainInstance.minePendingTransactions(walletMiner.address);

console.log("Check balances after the first mining:")
console.log(`Balance of User1: ${blockchainInstance.getBalance(walletAlice.address)}`);
console.log(`Balance of User2: ${blockchainInstance.getBalance(walletBob.address)}`);
console.log(`Balance of Miner: ${blockchainInstance.getBalance(walletMiner.address)}`);




// Verify the blockchain's integrity
console.log("Is the blockchain valid?", blockchainInstance.isChainValid());

// Search for a transaction using the transaction hash
const transactionToFind = trx.calculateHash();
const foundTransaction = blockchainInstance.searchTransaction(transactionToFind);
if (foundTransaction) {
    console.log("Transaction found in the blockchain:", foundTransaction);
} else {
    console.log("Transaction not found in the blockchain.");
}


console.log("get all the blocks of the blockchain");
blockchainInstance.chain.forEach((block, index) => {
    console.log(`Block #${index}:`, JSON.stringify(block, null, 2));
});

