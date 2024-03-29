// Import necessary modules and libraries
const { sha256 } = require("crypto.js");
const EC = require('elliptic').ec;
const ec = new EC('secp256k1');
const { Transaction } = require("./BlockChainProject2");

class Wallet {
    constructor() {
        this.key = ec.genKeyPair(); // Generate a new key pair for the wallet
        this.address = this.key.getPublic("hex"); // Derive the wallet address from the public key
        this.transactions = []; // Keep track of transactions relevant to this wallet
    }

    fundWallet(blockchainInstance){
        const transaction = new Transaction(null, this.address, 200);
        console.log("init transaction is:",transaction);
        blockchainInstance.addTransaction(transaction);
    }

    // Create a new transaction from this wallet to a recipient
    createTransaction(toAddress, amount) {
        const transaction = new Transaction(this.address, toAddress, amount);
        transaction.signTransaction(this.key); // Sign the transaction with the wallet's private key
        this.transactions.push(transaction); // Keep track of the created transaction
        return transaction;
    }


    // Verify if a transaction is authentic (signed by this wallet)
    verifyTransactionAuthentication(transaction) {
        return transaction.fromAddress === this.address && transaction.isValid();
    }

    // Get all transactions associated with this wallet
    getWalletTransactions() {
        return this.transactions;
    }
}

// Define the SPV class for simplified payment verification
class SPV {
    constructor(blockchain) {
        this.blockchain = blockchain;
    }

    // Verify the inclusion of a transaction using the Merkle tree
    verifyTransactionInclusion(transactionHash) {
        return this.blockchain.getLatestBlock().verifyTransactionInclusion(transactionHash);
    }
}

// Export the Wallet and SPV classes for external use
module.exports.Wallet = Wallet;
module.exports.SPV = SPV;
