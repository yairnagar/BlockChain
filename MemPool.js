// MemPool.js
const fs = require('fs');

class MemPool {
  constructor() {
    this.transactions = [];
    this.initTransactions(); 
  }

  initTransactions() {
    // Read transactions from sample-transactions.json
    const transactions = JSON.parse(fs.readFileSync('./sample-transactions.json'));

    // Add 30 sample transactions to mem pool
    this.transactions = transactions.slice(0, 30); 
  }
}

module.exports.MemPool = MemPool;