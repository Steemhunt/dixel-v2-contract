# Dixel Club V2

Pixel Art NFT factory that users can:
1. Creators: Create a new NFT collection with a 24x24 pixel art canvas with following parameters
    - name
    - symbol
    - description
    - max minting supply (1 - 1,000,000)
    - minting cost (in native currency: ETH, BNB, KLAY)
    - royalty (receiving address, percentage: 0 - 10%)
    - minting initiation time (unix timestamp)
    - whitelistOnly (boolean, whitelist can be added by the creator later)
    - hidden (boolean, hide the collection from the official main page listing)
2. Collectors: Mint a new edition on an existing collection with color variations

[🌏 Testnet Demo](https://v2testnet.dixel.club/) - Available on following testnets
- Ethereum Goerli ([Faucet](https://goerli-faucet.mudit.blog/), [Faucet2](https://faucet.paradigm.xyz/))
- Klayten Baobao ([Faucet](https://baobab.wallet.klaytn.foundation/faucet))
- BNB Smart Chain ([Faucet](https://testnet.binance.org/faucet-smart))

## Community Audit
We are holding a community-based security audit with **$10,000 USDT bounty** and we're inviting all developer community!
If you're willing to participate, please read the instructions below:

[🛠 Community Audit Guide](https://github.com/Steemhunt/dixel-v2-contract/blob/main/COMMUNITY_AUDIT.md)

Contribution made by **12 June 2022** will be counted

## Run Tests
```bash
npx hardhat test
```

## Contracts

### Ethereum Testnet (Goerli)
- DixelClubV2Factory: [0xe79D419da8F3625EF9D136F6632E810d3e2e1Fc6](https://goerli.etherscan.io/address/0xe79D419da8F3625EF9D136F6632E810d3e2e1Fc6#code)
- DixelClubV2NFT (implementation contract): [0x89Ba1a95C1e4CBbF53Bf65953b317eBb47110463](https://goerli.etherscan.io/address/0x89Ba1a95C1e4CBbF53Bf65953b317eBb47110463#code)

### BSC Testnet
- DixelClubV2Factory: [0x5d241D9e59006B7fa5E40F02f08dD679De0841E0](https://testnet.bscscan.com/address/0x5d241D9e59006B7fa5E40F02f08dD679De0841E0#code)
- DixelClubV2NFT (implementation contract): [0xa280Cde0E2066319629490eB50aABbcC622fc3ef](https://testnet.bscscan.com/address/0xa280Cde0E2066319629490eB50aABbcC622fc3ef#code)

### Klaytn Testnet (Baobob)
- DixelClubV2Factory: 0x3F1D6f939BE5b60Fadd2c4586Be286e861558F6b
- DixelClubV2NFT (implementation contract): 0x0A325d166426aFd2465AD7b0CC0C6Efa2E14E84e

## Deploy
```bash
npx hardhat compile

HARDHAT_NETWORK=bscmain node scripts/deploy.js

# Verify source code on Etherscan
npx hardhat verify --network bscmain {contract address} "parameter 1" "parameter 2"
```

## Gas Consumption
```
·-----------------------------------------------|---------------------------|--------------|-----------------------------·
|             Solc version: 0.8.13              ·  Optimizer enabled: true  ·  Runs: 1500  ·  Block limit: 60000000 gas  │
················································|···························|··············|······························
|  Methods                                      ·               25 gwei/gas                ·       1136.99 usd/eth       │
·······················|························|·············|·············|··············|···············|··············
|  Contract            ·  Method                ·  Min        ·  Max        ·  Avg         ·  # calls      ·  usd (avg)  │
·······················|························|·············|·············|··············|···············|··············
|  DixelClubV2Factory  ·  createCollection      ·     836700  ·     881744  ·      855762  ·          106  ·      24.32  │
·······················|························|·············|·············|··············|···············|··············
|  DixelClubV2Factory  ·  updateBeneficiary     ·          -  ·          -  ·       28965  ·            1  ·       0.82  │
·······················|························|·············|·············|··············|···············|··············
|  DixelClubV2Factory  ·  updateCreationFee     ·          -  ·          -  ·       28707  ·            1  ·       0.82  │
·······················|························|·············|·············|··············|···············|··············
|  DixelClubV2Factory  ·  updateImplementation  ·      28908  ·      28920  ·       28916  ·            3  ·       0.82  │
·······················|························|·············|·············|··············|···············|··············
|  DixelClubV2Factory  ·  updateMintingFee      ·          -  ·          -  ·       28673  ·            1  ·       0.82  │
·······················|························|·············|·············|··············|···············|··············
|  DixelClubV2NFT      ·  addWhitelist          ·      56650  ·     218123  ·      108808  ·           29  ·       3.09  │
·······················|························|·············|·············|··············|···············|··············
|  DixelClubV2NFT      ·  approve               ·          -  ·          -  ·       51478  ·            1  ·       1.46  │
·······················|························|·············|·············|··············|···············|··············
|  DixelClubV2NFT      ·  burn                  ·      45964  ·      50396  ·       47503  ·            8  ·       1.35  │
·······················|························|·············|·············|··············|···············|··············
|  DixelClubV2NFT      ·  mintPrivate           ·          -  ·          -  ·      164483  ·            2  ·       4.68  │
·······················|························|·············|·············|··············|···············|··············
|  DixelClubV2NFT      ·  mintPublic            ·     108921  ·     160425  ·      150073  ·           59  ·       4.27  │
·······················|························|·············|·············|··············|···············|··············
|  DixelClubV2NFT      ·  removeWhitelist       ·      40351  ·      40363  ·       40357  ·            2  ·       1.15  │
·······················|························|·············|·············|··············|···············|··············
|  DixelClubV2NFT      ·  resetWhitelist        ·          -  ·          -  ·       45193  ·            1  ·       1.28  │
·······················|························|·············|·············|··············|···············|··············
|  DixelClubV2NFT      ·  setApprovalForAll     ·          -  ·          -  ·       48921  ·            1  ·       1.39  │
·······················|························|·············|·············|··············|···············|··············
|  DixelClubV2NFT      ·  updateDescription     ·      39332  ·      91992  ·       59750  ·            4  ·       1.70  │
·······················|························|·············|·············|··············|···············|··············
|  DixelClubV2NFT      ·  updateMetadata        ·      35535  ·      38756  ·       36140  ·            6  ·       1.03  │
·······················|························|·············|·············|··············|···············|··············
|  Deployments                                  ·                                          ·  % of limit   ·             │
················································|·············|·············|··············|···············|··············
|  ColorUtilsMock                               ·          -  ·          -  ·      298893  ·        0.5 %  ·       8.50  │
················································|·············|·············|··············|···············|··············
|  DixelClubV2Factory                           ·    1155417  ·    1155429  ·     1155428  ·        1.9 %  ·      32.84  │
················································|·············|·············|··············|···············|··············
|  DixelClubV2NFT                               ·          -  ·          -  ·     4585970  ·        7.6 %  ·     130.36  │
················································|·············|·············|··············|···············|··············
|  DixelClubV2NFTMock                           ·          -  ·          -  ·     5233580  ·        8.7 %  ·     148.76  │
·-----------------------------------------------|-------------|-------------|--------------|---------------|-------------·
```
