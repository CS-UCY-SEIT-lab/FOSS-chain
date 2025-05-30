require("@nomicfoundation/hardhat-toolbox");

/** @type import('hardhat/config').HardhatUserConfig */
module.exports = {
  solidity: "0.8.19",
  networks: {
    hardhat: {
      accounts: [
        {
          privateKey:
            "0xa2aab1f33691c26de658f3becff1e930a395a2abf62d4ff7c753c5c87f2ea6a4",
          balance: "1000000000000000000",
        },
      ],
    },
  },
};
