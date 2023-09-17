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
  const [transactionInfo, setTransactionInfo] = useState();
  const [getBlockInfoExecuted, setGetBlockInfoExecuted] = useState(false);

  async function getBlockInfo(blockNumber) {
    const blockInfo = await alchemy.core.getBlock(blockNumber);
    setBlockInfo(blockInfo);
  }

  async function searchBlock(number) {
    if (number > blockNumber) {
      console.log("No such block yet exists")
      return;
    }
    getBlockInfo(number);
  }

  async function searchTransaction(hash) {
    const transactionInfo = await alchemy.core.getTransactionReceipt(hash);
    setTransactionInfo(transactionInfo);
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

      <div className='columns'>
        {blockInfo && (
          <div className='block-info'>
            <div>
              <h2>Selected Block: {blockInfo.number}</h2>
            </div>
            <div className='block-property'>
              <h3>Hash</h3>
              <p>
                {blockInfo.hash}
              </p>
            </div>
            <div className='block-property'>
              <h3>Parent Hash</h3>
              <p>
                {blockInfo.parentHash}
              </p>
            </div>
            <div className='block-property'>
              <h3>Timestamp</h3>
              <p>
                {blockInfo.timestamp}
              </p>
            </div>
            <div className='block-property'>
              <h3>Nonce</h3>
              <p>
                {blockInfo.nonce}
              </p>
            </div>
            <div className='block-property'>
              <h3>Difficulty</h3>
              <p>
                {blockInfo.difficulty}
              </p>
            </div>
            <div className='block-property'>
              <h3>Gas Limit</h3>
              <p>
                {blockInfo.gasLimit.toString()}
              </p>
            </div>
            <div className='block-property'>
              <h3>Gas Used</h3>
              <p>
                {blockInfo.gasUsed.toString()}
              </p>
            </div>
            <div className='block-property'>
              <h3>Miner</h3>
              <p>
                {blockInfo.miner}
              </p>
            </div>
            <div id='transactions' className='block-property'>
              <h3 className='transactions-heading'>Transactions</h3>
              <div className='all-transactions'>
              {blockInfo.transactions.map((transaction, index) => (
                <div key={index} className='transaction' onClick={async () => {
                  await searchTransaction(transaction);
                }}>
                  <p>
                    {transaction}
                  </p>
                </div>
              ))}
              </div>
            </div>
          </div>
        )}
        
        {transactionInfo && (
          <div className='transaction-info'>
            <div className='transaction-header'>
              <h2>Selected transaction: {transactionInfo.transactionHash}</h2>
            </div>
            <div className='block-property'>
              <h3>To</h3>
              <p>
                {transactionInfo.to}
              </p>
            </div>
            <div className='block-property'>
              <h3>From</h3>
              <p>
                {transactionInfo.from}
              </p>
            </div>
            <div className='block-property'>
              <h3>Contract Address</h3>
              <p>
                {transactionInfo.contractAddress}
              </p>
            </div>
            <div className='block-property'>
              <h3>Transaction Index</h3>
              <p>
                {transactionInfo.transactionIndex}
              </p>
            </div>
            <div className='block-property'>
              <h3>Gas Used</h3>
              <p>
                {transactionInfo.gasUsed.toString()}
              </p>
            </div>
            <div className='block-property'>
              <h3>Status</h3>
              <p>
                {transactionInfo.status}
              </p>
            </div>
            <div className='block-property'>
              <h3>Effective Gas Price</h3>
              <p>
                {transactionInfo.effectiveGasPrice.toString()}
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default App;
