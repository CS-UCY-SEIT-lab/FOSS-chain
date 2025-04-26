require("@nomicfoundation/hardhat-toolbox");

/** @type import('hardhat/config').HardhatUserConfig */
module.exports = {
  solidity: "0.8.19",
  networks: {
    hardhat: {
      accounts: [
        {
          privateKey:
            "0xa6b783890f7e3b5a9bd51429f38062c27dc0757eddbbb2675aedb5f2fd1b75f0",
          balance: "1000000000000000000",
        },
        {
          privateKey:
            "0x6dfa39256fa2ed657af616ffb5cdf121745d308143892b7013269563d0ccf5b3",
          balance: "1000000000000000000",
        },
        {
          privateKey:
            "0x90fb9d534bc1776fe5c575a153adfb6fbbddbee570d24f003d39360b0981959a",
          balance: "1000000000000000000",
        },
      ],
    },
  },
};
