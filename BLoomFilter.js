const { BloomFilter, XXHash } = require('bloom-filters');

class SimpleBloomFilter {
    constructor(size, numHashes) {
        this.bloomFilter = new BloomFilter(size, numHashes, XXHash);
    }

    add(value) {
        this.bloomFilter.add(value);
    }

    contains(value) {
        return this.bloomFilter.has(value);
    }
}

module.exports = SimpleBloomFilter;
