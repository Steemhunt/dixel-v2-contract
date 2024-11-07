# Dixel Club V2

[🌏 Official Interface](https://dixelclub.com/) | [📖 Official Docs](https://docs.dixelclub.com/)

Pixel Art NFT factory that users can:
1. Creators: Create a new NFT collection with a 24x24 pixel art canvas with following parameters
    - name
    - symbol
    - description
    - max minting supply (1 - 1,000,000)
    - minting cost (in native currency: ETH, BNB, KLAY, MATIC, OKT)
    - royalty (receiving address, percentage: 0 - 10%)
    - minting initiation time (unix timestamp)
    - whitelistOnly (boolean, whitelist can be added by the creator later)
    - hidden (boolean, hide the collection from the official main page listing)
2. Collectors: Mint a new edition on an existing collection with color variations

[🧪 Testnet Demo](https://v2testnet.dixel.club/) - Available on following testnets
- Ethereum Goerli ([Faucet](https://goerli-faucet.mudit.blog/), [Faucet2](https://faucet.paradigm.xyz/))
- Klayten Baobao ([Faucet](https://baobab.wallet.klaytn.foundation/faucet))
- BNB Smart Chain ([Faucet](https://testnet.binance.org/faucet-smart))

## Community Audit
We held a community-based security audit with **$10,000 USDT bounty**  in June 2022

- 🛠 Announcement: [Community Audit Guide](https://github.com/Steemhunt/dixel-v2-contract/blob/main/COMMUNITY_AUDIT.md)
- 💰 Result: https://github.com/Steemhunt/dixel-v2-contract/issues/28

## Run Tests
```bash
npx hardhat test
```

## Contracts
Latest version: v2.8.156 / NFT version: 4


### Ethereum - TODO: upgrade
- DixelClubV2Factory: [0x66BF6409A52E634262BD04c0005562f229b03778](https://etherscan.io/address/0x66BF6409A52E634262BD04c0005562f229b03778#code)
- DixelClubV2NFT (implementation): [0xDb1dC1d633df2c9075b8270C437832991680DF82](https://etherscan.io/address/0xDb1dC1d633df2c9075b8270C437832991680DF82#code)

### Base - TODO: upgrade
- DixelClubV2Factory: [0x82b91E6DEDE8B8acDADe2212983DF946CA695d1e](https://basescan.io/address/0x82b91E6DEDE8B8acDADe2212983DF946CA695d1e#code)
- DixelClubV2NFT (implementation): [0x1f3Af095CDa17d63cad238358837321e95FC5915](https://basescan.io/address/0x1f3Af095CDa17d63cad238358837321e95FC5915#code)

### BNB Chain - TODO: upgrade
- DixelClubV2Factory: [0xB76110E9cb56c0dba1596F3413A6DB9023e36463](https://bscscan.com/address/0xB76110E9cb56c0dba1596F3413A6DB9023e36463#code)
- DixelClubV2NFT (implementation): [0xc4C1D65719C7aBa1Ab5f254Ff17f1806d701448E](https://bscscan.com/address/0xc4C1D65719C7aBa1Ab5f254Ff17f1806d701448E#code)

### Polygon - TODO: upgrade
- DixelClubV2Factory: [0xa8F498E42884677b4055bEE3cc9970f4A8555ff9](https://polygonscan.com/address/0xa8F498E42884677b4055bEE3cc9970f4A8555ff9#code)
- DixelClubV2NFT: [0x1bD78fD584E315fB0593d643a3E242BC37C4d615](https://polygonscan.com/address/0x1bD78fD584E315fB0593d643a3E242BC37C4d615#code)

### Klaytn - TODO: upgrade
- DixelClubV2Factory: [0x31B8eb1d3DcB2C333e5d70cAA022855ffdBD0fDA](https://kaiascope.com/account/0x31B8eb1d3DcB2C333e5d70cAA022855ffdBD0fDA?tabId=contractCode)
- DixelClubV2NFT (implementation): [0x258e69403866CE766A6Df866ca27C1e4B1C8Bde1](https://kaiascope.com/account/0x258e69403866CE766A6Df866ca27C1e4B1C8Bde1?tabId=contractCode)

### Base Sepolia
- DixelClubV2Factory: [0xC14d558AfFE9457E620338E7f2166Ae29E884463](https://sepolia.basescan.org/address/0xC14d558AfFE9457E620338E7f2166Ae29E884463#code)
- DixelClubV2NFT (implementation): [0xB43826E079dFB2e2b48a0a473Efc7F1fe6391763](https://sepolia.basescan.org/address/0xB43826E079dFB2e2b48a0a473Efc7F1fe6391763#code)


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
|  Methods                                      ·               10 gwei/gas                ·       1058.96 usd/eth       │
·······················|························|·············|·············|··············|···············|··············
|  Contract            ·  Method                ·  Min        ·  Max        ·  Avg         ·  # calls      ·  usd (avg)  │
·······················|························|·············|·············|··············|···············|··············
|  DixelClubV2Factory  ·  createCollection      ·     821427  ·     866471  ·      840542  ·          105  ·       8.90  │
·······················|························|·············|·············|··············|···············|··············
|  DixelClubV2Factory  ·  updateBeneficiary     ·          -  ·          -  ·       28965  ·            1  ·       0.31  │
·······················|························|·············|·············|··············|···············|··············
|  DixelClubV2Factory  ·  updateCreationFee     ·          -  ·          -  ·       28685  ·            1  ·       0.30  │
·······················|························|·············|·············|··············|···············|··············
|  DixelClubV2Factory  ·  updateImplementation  ·      28908  ·      28920  ·       28916  ·            3  ·       0.31  │
·······················|························|·············|·············|··············|···············|··············
|  DixelClubV2Factory  ·  updateMintingFee      ·          -  ·          -  ·       28673  ·            1  ·       0.30  │
·······················|························|·············|·············|··············|···············|··············
|  DixelClubV2NFT      ·  addWhitelist          ·      56650  ·     218123  ·      108808  ·           29  ·       1.15  │
·······················|························|·············|·············|··············|···············|··············
|  DixelClubV2NFT      ·  approve               ·          -  ·          -  ·       51478  ·            1  ·       0.55  │
·······················|························|·············|·············|··············|···············|··············
|  DixelClubV2NFT      ·  burn                  ·      45964  ·      50396  ·       47503  ·            8  ·       0.50  │
·······················|························|·············|·············|··············|···············|··············
|  DixelClubV2NFT      ·  mintPrivate           ·          -  ·          -  ·      164506  ·            2  ·       1.74  │
·······················|························|·············|·············|··············|···············|··············
|  DixelClubV2NFT      ·  mintPublic            ·     108921  ·     160448  ·      150094  ·           59  ·       1.59  │
·······················|························|·············|·············|··············|···············|··············
|  DixelClubV2NFT      ·  removeWhitelist       ·      40351  ·      40363  ·       40357  ·            2  ·       0.43  │
·······················|························|·············|·············|··············|···············|··············
|  DixelClubV2NFT      ·  resetWhitelist        ·          -  ·          -  ·       45193  ·            1  ·       0.48  │
·······················|························|·············|·············|··············|···············|··············
|  DixelClubV2NFT      ·  setApprovalForAll     ·          -  ·          -  ·       48921  ·            1  ·       0.52  │
·······················|························|·············|·············|··············|···············|··············
|  DixelClubV2NFT      ·  updateDescription     ·      34636  ·      77277  ·       50369  ·            4  ·       0.53  │
·······················|························|·············|·············|··············|···············|··············
|  DixelClubV2NFT      ·  updateMetadata        ·      35535  ·      38756  ·       36140  ·            6  ·       0.38  │
·······················|························|·············|·············|··············|···············|··············
|  Deployments                                  ·                                          ·  % of limit   ·             │
················································|·············|·············|··············|···············|··············
|  ColorUtilsMock                               ·          -  ·          -  ·      298893  ·        0.5 %  ·       3.17  │
················································|·············|·············|··············|···············|··············
|  DixelClubV2Factory                           ·    1086188  ·    1086200  ·     1086199  ·        1.8 %  ·      11.50  │
················································|·············|·············|··············|···············|··············
|  DixelClubV2NFT                               ·          -  ·          -  ·     4500080  ·        7.5 %  ·      47.65  │
················································|·············|·············|··············|···············|··············
|  DixelClubV2NFTMock                           ·          -  ·          -  ·     5147733  ·        8.6 %  ·      54.51  │
·-----------------------------------------------|-------------|-------------|--------------|---------------|-------------·
```
