require('@nomiclabs/hardhat-ethers');
require("@nomicfoundation/hardhat-chai-matchers");
require('@nomicfoundation/hardhat-toolbox');
require('dotenv').config();

const { bscscanApiKey, PRIVATE_KEY } = process.env;

module.exports = {
  solidity: "0.8.22",
  networks: {
    bscTestnet: {
      url: "https://data-seed-prebsc-1-s1.bnbchain.org:8545",
      chainId: 97,
      gasPrice: 20000000000,
      accounts: [PRIVATE_KEY]
    },
  },
  etherscan: {
    // Your API key for Etherscan
    // Obtain one at https://bscscan.com/
    apiKey: bscscanApiKey
  }
};

// Deploying contracts with the account: 0x298Aa06cad29f90219f0016e544c0135D1594477
// Account balance: 602943840000000000
// Auction address: 0xECAfF267727a46b1c203A837eCF171C85DcCe78A