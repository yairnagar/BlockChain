// Import necessary modules and libraries
const { sha256 } = require("crypto.js");
const EC = require('elliptic').ec;
const ec = new EC('secp256k1');
const SimpleBloomFilter = require('./BLoomFilter'); // Adjust the path accordingly
const { default: MerkleTree } = require("merkletreejs");

// Define the Transaction class
class Transaction {
    constructor(fromAddress, toAddress, amount){
        this.fromAddress = fromAddress;
        this.toAddress = toAddress;
        this.amount = amount;
        this.timestamp = Date.now();
    }

    // Calculate the hash of the transaction
    calculateHash() {
        return sha256(this.fromAddress + this.toAddress + this.amount + this.timestamp).toString();
    }

    // Sign the transaction using the provided signing key
    signTransaction(signingKey){
        // Check if the public key derived from the signing key matches the transaction's 'fromAddress'
        if(signingKey.getPublic('hex') !== this.fromAddress){
            // If not, throw an error indicating that the transaction cannot be signed with another wallet
            throw new Error('You can not sign transaction with another wallet');
        }

        // Calculate the hash of the transaction
         this.hashTx = this.calculateHash();

        // Use the signing key to sign the hash, encoding the result in base64
        const sig = signingKey.sign(this.hashTx, 'base64');

        // Convert the signature to a DER (Distinguished Encoding Rules) encoded hexadecimal string
        this.signature = sig.toDER('hex');
    }

    // Check the validity of the transaction
    isValid(){
        // If 'fromAddress' is null, consider the transaction as valid (e.g., for mining rewards)
        if(this.fromAddress == null) return true;

        // If 'toAddress' is null, consider the transaction as valid (e.g., for burn function)
        if(this.toAddress == null) return true;

        // Check if there is a valid signature present in the transaction
        if(!this.signature || this.signature.length === 0){
            throw new Error('No signature in the transaction');
        }

        // Create a public key object from the 'fromAddress'
        const publicKey = ec.keyFromPublic(this.fromAddress, 'hex');

        // Verify the signature against the calculated hash of the transaction
        return publicKey.verify(this.calculateHash(), this.signature);
    }

}

// Define the Block class
class Block {
    constructor(timestamp, transactions, previousHash = ''){
        this.previousHash = previousHash;
        this.timestamp = timestamp;
        this.transactions = transactions;
        this.hash = this.calculateHash()
        this.merkleRoot = "";
        this.nonce = 0;
    }

    // Calculate the hash of the block
    calculateHash(){
        return sha256(this.previousHash + this.timestamp + JSON.stringify(this.transactions) + this.nonce).toString();
    }

    // Calculate the Merkle Root of the transactions in the block
    calculateMerkleRoot() {
        const leaves = this.transactions.map((tx) => sha256(tx.calculateHash()).toString('hex'));
        const tree = new MerkleTree(leaves, sha256);
        this.merkleRoot = tree.getRoot().toString('hex');
        console.log('Calculated Merkle Root:', this.merkleRoot);
    }

    // Verify the inclusion of a transaction in the Merkle tree
    verifyTransactionInclusion(transactionHash) {
        const transactionHashBuffer = Buffer.from(transactionHash, 'hex');
        const leaves = this.transactions.map((tx) => tx.calculateHash());
        const tree = new MerkleTree(leaves, sha256);
    
        const inclusionProof = tree.getProof(transactionHashBuffer);
    
        const verificationResult = tree.verify(inclusionProof, transactionHashBuffer, tree.getRoot());
    
        console.log('Verification Result:', verificationResult);
    
        return verificationResult;
    }

    // Mine the block with a given difficulty
    mineBlock(difficulty){
        while(this.hash.substring(0,difficulty) !== Array(difficulty+1).join('0')){
            this.nonce++;
            this.hash = this.calculateHash();
        }
        console.log('Block Mined : ' + this.hash);
    }

    // Check if the block has valid transactions
    hasValidTransaction(){
        for(const tx of this.transactions){
            if(!tx.isValid()){
                return false;
            }
            return true;
        }
    }
}

// Define the Blockchain class
class BlockChain {
    constructor(){
        this.chain = [this.createGenesisBlock()];
        this.difficulty = 5;
        this.pendingTransactions = [];
        this.miningReward = 25;
        this.transactionFilter = new SimpleBloomFilter(256, 4);
    }

    // Create the genesis block
    createGenesisBlock(){
        return new Block(0, "01/01/2009", 'genesis block', '0');
    }

    // Get the latest block in the chain
    getLatestBlock(){
        return this.chain[this.chain.length-1];
    }

    // Mine pending transactions and add a reward transaction
    minePendingTransactions(miningRewardAddress) {
        const rewardTx = new Transaction(null, miningRewardAddress, this.miningReward);
        this.pendingTransactions.push(rewardTx);

        let block = new Block(Date.now(), this.pendingTransactions, this.getLatestBlock().hash);

        // Calculate Merkle Root before mining
        block.calculateMerkleRoot();

        block.mineBlock(this.difficulty);
        console.log('Block Successfully Mined');
        this.chain.push(block);
        this.pendingTransactions = [];
    }

    // Add a transaction to the pending transactions and Bloom filter
    addTransaction(transaction){
        if (!transaction.isValid()) {
            throw new Error('Can not add an invalid transaction');
        }
        this.pendingTransactions.push(transaction);
        this.transactionFilter.add(transaction.calculateHash());
    }

    // Get the balance of an address in the blockchain
    getBalance(address){
        let balance = 0;
        for(const block of this.chain){
            for(const transaction of block.transactions){
                if(transaction.fromAddress == address){
                    balance -= transaction.amount;
                }
                if(transaction.toAddress == address){
                    balance += transaction.amount;
                }
            }
        }
        return balance;
    }

    // Check if the blockchain is valid
    isChainValid(){
        for(let i = 1; i < this.chain.length; i++){
            const currentBlock = this.chain[i];
            const previousBlock = this.chain[i-1];
            if (!currentBlock.hasValidTransaction()) {
                return false;
            }
            if(currentBlock.hash !== currentBlock.calculateHash()){
                return false;
            }
            if(currentBlock.previousHash !== previousBlock.hash){
                return false;
            }
        }
        return true;
    }

    // Search for a transaction using the Bloom filter and blockchain
    searchTransaction(transactionHash) {
        // Check if the transaction hash might exist in the Bloom filter
        if (this.transactionFilter.contains(transactionHash)) {
            // Now you can perform a more expensive search, e.g., in the blockchain
            for (const block of this.chain) {
                for (const tx of block.transactions) {
                    if (tx?.calculateHash && tx.calculateHash() === transactionHash) {
                        return tx;
                    }
                }
            }
        }

        // Transaction not found
        return null;
    }

    getPendingTransactionsLength(){
        return this.pendingTransactions.length;
    }


}

// Export the classes for external use
module.exports.BlockChain = BlockChain;
module.exports.Block = Block;
module.exports.Transaction = Transaction;
