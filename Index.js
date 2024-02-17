const { Wallet, SPV } = require("./WalletSPV");
const { BlockChain, Block, Transaction } = require('./BlockChainProject2');
const fs = require('fs');


function getRandomInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function burn(sourceAccount, blockchainInstance){
    console.log("pre burn balance:", blockchainInstance.getBalance(sourceAccount.address))
    const trx = sourceAccount.createTransaction(sourceAccount,null,2);
    blockchainInstance.addTransaction(trx);
    console.log("post burn balance:", blockchainInstance.getBalance(sourceAccount.address))
}

const transactions = [];
const wallets = [];
const signatures =[];


console.log("creating new Blockchain instance")
let blockchainInstance = new BlockChain();
console.log("blockchainInstance", blockchainInstance);


console.log("creating wallets")
const walletMica = new Wallet();
const walletTom = new Wallet();
const walletYair = new Wallet();
wallets.push(walletMica);
wallets.push(walletTom);
wallets.push(walletYair);


console.log("fund wallets")
walletMica.fundWallet(blockchainInstance);//init wallet
walletTom.fundWallet(blockchainInstance);//init wallet
walletYair.fundWallet(blockchainInstance);//init wallet
console.log("mica balance:", blockchainInstance.getBalance(walletMica.address))

console.log("Starting the miner and mining a block");
const walletMiner = new Wallet();


console.log("initiating 30 transactions")
 for(let i=0; i<30; i++){

    if( blockchainInstance.getPendingTransactionsLength() == 4){//if we have 4 transactions in the mempool->mine new block
        blockchainInstance.minePendingTransactions(walletMiner.address);
    }

     fromWallet = wallets[getRandomInt(0,2)];
     toWallet = wallets[getRandomInt(0,2)];
     while(fromWallet == toWallet){
         fromWallet = wallets[getRandomInt(0,2)];
     }
     const amountToTransfer = getRandomInt(1,10);

     if(fromWallet.getBalance<amountToTransfer){//validating that the source address has sufficient funds
        console.log("insufficient funds !")
        return;
     }

     const trx = fromWallet.createTransaction(toWallet.address,amountToTransfer);//creating trx
     blockchainInstance.addTransaction(trx);//adding transaction to the mempool 

     //burn(fromWallet,blockchainInstance);
     
        
    const signatureData = {
            hashTx: trx.hashTx,
            signature: trx.signature,
        };
        


     transactions.push(trx);
     signatures.push(signatureData);

 }
 
 fs.writeFileSync('./sample-transactions.json', JSON.stringify(transactions));
 fs.writeFileSync('./sample-signatures.json', JSON.stringify(signatures));


blockchainInstance.minePendingTransactions(walletMiner.address);

console.log("Check balances after the first mining:")
console.log(`Balance of Mica: ${blockchainInstance.getBalance(walletMica.address)}`);
console.log(`Balance of Tom: ${blockchainInstance.getBalance(walletTom.address)}`);
console.log(`Balance of Yair: ${blockchainInstance.getBalance(walletYair.address)}`);
console.log(`Balance of Miner: ${blockchainInstance.getBalance(walletMiner.address)}`);




// Verify the blockchain's integrity
console.log("Is the blockchain valid?", blockchainInstance.isChainValid());

// Search for a transaction using the transaction hash
const transactionToFind = transactions[0].calculateHash();
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

