// Import necessary modules and libraries
const { sha256 } = require("crypto.js");
const EC = require('elliptic').ec;
const ec = new EC('secp256k1');
const { Transaction } = require("./BlockChainProject2");

// Define the Wallet class for simplified wallet functionality
class Wallet {
    constructor() {
        this.key = ec.genKeyPair(); // Generate a new key pair for the wallet
        this.address = this.key.getPublic("hex"); // Derive the wallet address from the public key
    }

    // Create a new transaction from this wallet to a recipient
    createTransaction(toAddress, amount) {
        const transaction = new Transaction(this.address, toAddress, amount);
        transaction.signTransaction(this.key); // Sign the transaction with the wallet's private key
        return transaction;
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
