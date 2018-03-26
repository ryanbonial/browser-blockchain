'use strict';

const blockchain = new BlockChain();

document.addEventListener('DOMContentLoaded', init);

function init() {
  const addBlockButton = document.getElementById('add-block-button');
  addBlockButton.addEventListener('click', addBlock);
  const verifyChainButton = document.getElementById('verify-chain-button');
  verifyChainButton.addEventListener('click', verifyChain);
  initializeBlockchain();
}

function initializeBlockchain() {
  const startTime = performance.now();
  blockchain.createGenesisBlock()
    .then(() => {
      const generationTime = performance.now() - startTime;
      console.log(blockchain, `Generated in ${generationTime} milliseconds`);
      displayBlockchain();
    })
    .then(() => {
    });
}

function addBlock(ev) {
  const newBlockData = document.getElementById('new-block-data');
  const lastHash = blockchain.getLastBlockHash();
  const startTime = performance.now();
  blockchain.createBlock(newBlockData.value, lastHash).then(() => {
    const generationTime = performance.now() - startTime;
    console.log(blockchain, `Generated in ${generationTime} milliseconds`);
    newBlockData.value = '';
    displayBlockchain();
  });
}

function displayBlockchain() {
  document.querySelector('#blockchain').innerHTML = JSON.stringify(blockchain.chain, undefined, 2)
  blockchain.blockIsValid(blockchain.chain[0]).then(isValid => console.log(isValid))
}

function verifyChain() {
  blockchain.verifyChain()
    .then(isValid => alert('chain validation: ' + isValid),
      error => alert('chain validation: ' + error));
}

