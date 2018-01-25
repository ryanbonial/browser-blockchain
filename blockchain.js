'use strict';

class BlockChain {
  constructor() {
    this.chain = [];
  }

  // This creates the first block in the blockchain, often called the genesis block
  createGenesisBlock() {
    return this.createBlock('Genesis Block', '0');
  }

  // Create a block on the blockchain
  createBlock(data, previousBlock) {
    let block = {
      previousBlock,
      data,
      challenge: '000',
      createDatetime: Date.now()
    };

    const blockDataString = block.previousBlock + JSON.stringify(block.data) + block.challenge + block.createDatetime;

    return this.mineBlock(blockDataString, block.challenge)
      .then(minedHash => {
        block.hash = minedHash.hash;
        block.proofOfWork = minedHash.nonce;
        this.chain.push(block)
      });
  }

  // Find a hash that meets the challenge
  mineBlock(blockDataString, challenge, nonce = 0) {
    const blockDataStringWithNonce = blockDataString + nonce;
    return sha256(blockDataStringWithNonce).then(hash => {
      if (hash.substring(0, challenge.length) != challenge) {
        nonce++ // hash didn't meet the challenge requirements, increment nonce to get a different hash
        return this.mineBlock(blockDataString, challenge, nonce);
      } else {
        return { hash, nonce };
      }
    });
  }

  blockIsValid(block){
    const blockDataString = block.previousBlock + JSON.stringify(block.data) + block.challenge + block.createDatetime + block.proofOfWork;
    return sha256(blockDataString).then(hash => block.hash === hash);
  }

  getLastBlockHash() {
    return this.chain[this.chain.length - 1].hash;
  }

  verifyChain() {
    let prevHash = '0';
    let chainIsValid = true;
    return new Promise((resolve, reject) => {
      this.chain.forEach(block => {
        this.blockIsValid(block).then(isValid => {
          if (!isValid || block.previousBlock !== prevHash) {
            reject('chain is not valid')
          }
        })
      });
      resolve(chainIsValid);
    });
  }
}