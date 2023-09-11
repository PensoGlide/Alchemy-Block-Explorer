import { Alchemy, Network } from 'alchemy-sdk';
import { useEffect, useState } from 'react';

import './App.css';

// Refer to the README doc for more information about using API
// keys in client-side code. You should never do this in production
// level code.
const settings = {
  apiKey: process.env.REACT_APP_ALCHEMY_API_KEY,
  network: Network.ETH_MAINNET,
};


// In this week's lessons we used ethers.js. Here we are using the
// Alchemy SDK is an umbrella library with several different packages.
//
// You can read more about the packages here:
//   https://docs.alchemy.com/reference/alchemy-sdk-api-surface-overview#api-surface
const alchemy = new Alchemy(settings);

function App() {
  const [blockNumber, setBlockNumber] = useState();
  const [selectedBlockNumber, setSelectedBlockNumber] = useState();
  const [blockInfo, setBlockInfo] = useState();
  const [getBlockInfoExecuted, setGetBlockInfoExecuted] = useState(false);

  async function getBlockInfo(blockNumber) {
    const blockInfo = await alchemy.core.getBlock(blockNumber);
    console.log(blockInfo);
    setBlockInfo(blockInfo);
  }

  async function searchBlock(number) {
    if (number > blockNumber) {
      console.log("No such block yet exists")
      return;
    }
    getBlockInfo(number);
  }

  useEffect(() => {
    async function getBlockNumber() {
      setBlockNumber(await alchemy.core.getBlockNumber());
    }

    // Get initial block number
    getBlockNumber().then(() => {
      // Check if selectedBlockNumber has been defined and if getBlockInfo has not been executed yet
      setSelectedBlockNumber(blockNumber);
      if (selectedBlockNumber && !getBlockInfoExecuted) {
        console.log(selectedBlockNumber)
        getBlockInfo(selectedBlockNumber);
        setGetBlockInfoExecuted(true); // Set the flag to true to indicate that getBlockInfo has been executed
      }
    });

    // Get further block numbers
    alchemy.ws.on("block", (blockNumber) =>{
      setBlockNumber(blockNumber);
    });
  });

  return (
    <div className="App">
      <div className='header'>
        <div className='latest-block' onClick={() => getBlockInfo(blockNumber)}>
          Latest Block Number: {blockNumber}
        </div>
        <div className='search-block'> 
          <label>
            Select block number: 
            <input type="number" onChange={(e) => {searchBlock(e.target.valueAsNumber)}}/>
          </label>
        </div>
      </div>

      {blockInfo && (
        <div className='block-info'>
          <div>
            <h2>Selected Block: {blockInfo.number}</h2>
          </div>
          <div className='block-property'>
            <p>Hash</p>
            {blockInfo.hash}
          </div>
          <div className='block-property'>
            <p>Parent Hash</p>
            {blockInfo.parentHash}
          </div>
          <div className='block-property'>
            <p>Timestamp</p>
            {blockInfo.timestamp}
          </div>
          <div className='block-property'>
            <p>Nonce</p>
            {blockInfo.nonce}
          </div>
          <div className='block-property'>
            <p>Difficulty</p>
            {blockInfo.difficulty}
          </div>
          <div className='block-property'>
            <p>Gas Limit</p>
            {blockInfo.gasLimit.toString()}
          </div>
          <div className='block-property'>
            <p>Gas Used</p>
            {blockInfo.gasUsed.toString()}
          </div>
          <div className='block-property'>
            <p>Miner</p>
            {blockInfo.miner}
          </div>
          <div className='block-property'>
            <p>Transactions</p>
            {blockInfo.transactions}
          </div>
        </div>
      )}
    </div>
  );
}

export default App;
