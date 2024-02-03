const { MerkleTree } = require('merkletreejs');
const SHA256 = require('crypto-js/sha256');

// Create an array of leaves by hashing the values 'a', 'b', and 'c'
const leaves = ['a', 'b', 'c'].map(x => SHA256(x));

// Create a Merkle tree with the leaves and the SHA256 hash function
const tree = new MerkleTree(leaves, SHA256);

// Get the root of the Merkle tree as a hexadecimal string
const root = tree.getRoot().toString('hex');

// Hash the value 'a' to be used as a leaf for verification
const leaf = SHA256('a');

// Get the Merkle proof for the leaf
const proof = tree.getProof(leaf);

// Verify the proof against the root and the original leaf
console.log(tree.verify(proof, leaf, root)); // true

// Create another set of leaves with values 'a', 'x', and 'c'
const badLeaves = ['a', 'x', 'c'].map(x => SHA256(x));

// Create another Merkle tree with the bad leaves
const badTree = new MerkleTree(badLeaves, SHA256);

// Hash the value 'x' to be used as a bad leaf for verification
const badLeaf = SHA256('x');

// Get the Merkle proof for the bad leaf
const badProof = badTree.getProof(badLeaf);

// Verify the bad proof against the root and the bad leaf
console.log(badTree.verify(badProof, badLeaf, root)); // false

// Print the string representation of the Merkle tree
console.log(tree.toString());
